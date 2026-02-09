#!/bin/bash

# Export Great Lakes University content using drush dce
# This script exports content and organizes it into the appropriate recipe directories

# Don't exit on errors, handle them gracefully
set +e

# Base directories
BASE_DIR="/var/www/html/recipes/dripyard_greatlakes"
DEMO_CONTENT_DIR="$BASE_DIR/recipes/dripyard_greatlakes/dripyard_greatlakes_demo_content/content"
LAYOUT_BUILDER_DIR="$BASE_DIR/recipes/dripyard_greatlakes/dripyard_greatlakes_layout_builder_demo/content"

echo "Starting Great Lakes content export..."

# Create necessary directories
mkdir -p "$DEMO_CONTENT_DIR"/{block_content,node,media,menu_link_content,taxonomy_term,file}
mkdir -p "$LAYOUT_BUILDER_DIR"/node

cd "$BASE_DIR"

# Function to sanitize filename (replace spaces and special chars with underscores, lowercase)
sanitize_filename() {
    echo "$1" | tr '[:upper:]' '[:lower:]' | sed 's/[^a-z0-9]/_/g' | sed 's/__*/_/g' | sed 's/^_\|_$//g'
}

# Function to get entity IDs for a specific entity type and bundle
get_entity_ids() {
    local entity_type=$1
    local bundle=$2

    echo "  Debug: Getting IDs for $entity_type ($bundle)" >&2

    if [ "$entity_type" = "file" ]; then
        # Files don't have bundles
        drush ev "
            \$ids = \Drupal::entityQuery('file')->accessCheck(FALSE)->execute();
            echo 'Debug: Found ' . count(\$ids) . ' file entities' . PHP_EOL;
            foreach (\$ids as \$id) {
                echo \$id . PHP_EOL;
            }
        "
    elif [ "$entity_type" = "menu_link_content" ]; then
        # Menu links don't filter by bundle
        drush ev "
            \$ids = \Drupal::entityQuery('menu_link_content')->accessCheck(FALSE)->execute();
            echo 'Debug: Found ' . count(\$ids) . ' menu_link_content entities' . PHP_EOL;
            foreach (\$ids as \$id) {
                echo \$id . PHP_EOL;
            }
        "
    elif [ "$entity_type" = "media" ]; then
        # Media entities use 'bundle' field instead of 'type'
        drush ev "
            \$ids = \Drupal::entityQuery('media')
                ->condition('bundle', '$bundle')
                ->accessCheck(FALSE)
                ->execute();
            echo 'Debug: Found ' . count(\$ids) . ' media entities of bundle $bundle' . PHP_EOL;
            foreach (\$ids as \$id) {
                echo \$id . PHP_EOL;
            }
        "
    else
        # Other entity types with bundles (node, block_content, taxonomy_term)
        drush ev "
            try {
                \$ids = \Drupal::entityQuery('$entity_type')
                    ->condition('type', '$bundle')
                    ->accessCheck(FALSE)
                    ->execute();
                echo 'Debug: Found ' . count(\$ids) . ' $entity_type entities of type $bundle' . PHP_EOL;
                foreach (\$ids as \$id) {
                    echo \$id . PHP_EOL;
                }
            } catch (Exception \$e) {
                echo 'Error: ' . \$e->getMessage() . PHP_EOL;
            }
        "
    fi
}

# Function to get entity title/name for filename
get_entity_title() {
    local entity_type=$1
    local entity_id=$2

    case $entity_type in
        "node"|"menu_link_content")
            drush ev "
                try {
                    \$entity = \Drupal::entityTypeManager()->getStorage('$entity_type')->load($entity_id);
                    echo \$entity ? \$entity->getTitle() : 'untitled';
                } catch (Exception \$e) {
                    echo 'untitled';
                }
            "
            ;;
        "block_content")
            drush ev "
                try {
                    \$entity = \Drupal::entityTypeManager()->getStorage('$entity_type')->load($entity_id);
                    echo \$entity ? \$entity->label() : 'untitled';
                } catch (Exception \$e) {
                    echo 'untitled';
                }
            "
            ;;
        "media"|"taxonomy_term")
            drush ev "
                try {
                    \$entity = \Drupal::entityTypeManager()->getStorage('$entity_type')->load($entity_id);
                    echo \$entity ? \$entity->getName() : 'untitled';
                } catch (Exception \$e) {
                    echo 'untitled';
                }
            "
            ;;
        "file")
            drush ev "
                try {
                    \$entity = \Drupal::entityTypeManager()->getStorage('$entity_type')->load($entity_id);
                    echo \$entity ? \$entity->getFilename() : 'untitled';
                } catch (Exception \$e) {
                    echo 'untitled';
                }
            "
            ;;
        *)
            echo "item_$entity_id"
            ;;
    esac
}

# Function to export content by entity type and bundle
export_content() {
    local entity_type=$1
    local bundle=$2
    local target_dir=$3

    echo "=== Exporting $entity_type ($bundle) ==="

    # Get all entity IDs for this type/bundle
    get_entity_ids "$entity_type" "$bundle" | while read -r entity_id; do
        if [[ -n "$entity_id" && "$entity_id" =~ ^[0-9]+$ ]]; then
            # Get entity title for filename
            title=$(get_entity_title "$entity_type" "$entity_id")
            sanitized_title=$(sanitize_filename "$title")

            # Create filename in bundle-title.yml format
            if [ "$entity_type" = "file" ]; then
                filename="$sanitized_title.yml"
            else
                filename="$bundle-$sanitized_title.yml"
            fi

            echo "  Exporting $entity_type:$entity_id ($title) -> $filename"

            # Export using drush dce with entity_type_id and entity_id
            drush dce "$entity_type" "$entity_id" --file="$target_dir/$entity_type/$filename" --yes || echo "    Warning: Failed to export $entity_type:$entity_id"

            # Handle file copying for file entities
            if [ "$entity_type" = "file" ]; then
                copy_physical_file "$entity_id" "$target_dir"
            fi
        fi
    done
}

# Function to copy physical files
copy_physical_file() {
    local entity_id=$1
    local target_dir=$2

    # Get file information
    file_info=$(drush ev "
        \$file = \Drupal::entityTypeManager()->getStorage('file')->load($entity_id);
        if (\$file) {
            echo \$file->getFilename() . '|' . \$file->getFileUri();
        }
    " 2>/dev/null)

    if [[ -n "$file_info" ]]; then
        IFS='|' read -r filename file_uri <<< "$file_info"

        # Copy the actual physical file
        if [[ "$file_uri" == "public://"* ]]; then
            # Convert public:// URI to actual file path
            public_path=$(drush ev "echo \Drupal::service('file_system')->realpath('public://');" 2>/dev/null)
            relative_path=${file_uri#public://}
            source_file="$public_path/$relative_path"

            if [[ -f "$source_file" ]]; then
                # Create the same directory structure in the recipe
                dest_dir="$target_dir/file/$(dirname "$relative_path")"
                mkdir -p "$dest_dir"

                # Copy the actual file
                cp "$source_file" "$dest_dir/$(basename "$relative_path")"
                echo "    Copied physical file: $relative_path"
            else
                echo "    Warning: Physical file not found: $source_file"
            fi
        elif [[ "$file_uri" == "private://"* ]]; then
            # Handle private files
            private_path=$(drush ev "echo \Drupal::service('file_system')->realpath('private://');" 2>/dev/null)
            relative_path=${file_uri#private://}
            source_file="$private_path/$relative_path"

            if [[ -f "$source_file" ]]; then
                # Create the same directory structure in the recipe
                dest_dir="$target_dir/file/$(dirname "$relative_path")"
                mkdir -p "$dest_dir"

                # Copy the actual file
                cp "$source_file" "$dest_dir/$(basename "$relative_path")"
                echo "    Copied physical file: $relative_path"
            else
                echo "    Warning: Physical file not found: $source_file"
            fi
        else
            echo "    Warning: Unsupported file URI scheme: $file_uri"
        fi
    fi
}

# Export nodes
echo ""
echo "=== EXPORTING NODES ==="

# Export dripyard_landing_page nodes to layout builder demo
if drush ev "echo \Drupal::entityQuery('node')->condition('type', 'dripyard_landing_page')->accessCheck(FALSE)->count()->execute();" 2>/dev/null | grep -q '^[1-9]'; then
    export_content "node" "dripyard_landing_page" "$LAYOUT_BUILDER_DIR"
fi

# Export other node types to demo content
for bundle in article page; do
    count=$(drush ev "echo \Drupal::entityQuery('node')->condition('type', '$bundle')->accessCheck(FALSE)->count()->execute();" 2>/dev/null)
    echo "  Debug: Found $count $bundle nodes" >&2
    if [[ "$count" =~ ^[1-9] ]]; then
        export_content "node" "$bundle" "$DEMO_CONTENT_DIR"
    fi
done

# Export block content
echo ""
echo "=== EXPORTING BLOCK CONTENT ==="
for bundle in $(drush ev "
    foreach (\Drupal::entityTypeManager()->getStorage('block_content_type')->loadMultiple() as \$type) {
        echo \$type->id() . PHP_EOL;
    }
" 2>/dev/null); do
    if [[ -n "$bundle" ]]; then
        export_content "block_content" "$bundle" "$DEMO_CONTENT_DIR"
    fi
done

# Export media
echo ""
echo "=== EXPORTING MEDIA ==="
for bundle in $(drush ev "
    foreach (\Drupal::entityTypeManager()->getStorage('media_type')->loadMultiple() as \$type) {
        echo \$type->id() . PHP_EOL;
    }
"); do
    if [[ -n "$bundle" ]]; then
        count=$(drush ev "echo \Drupal::entityQuery('media')->condition('bundle', '$bundle')->accessCheck(FALSE)->count()->execute();")
        echo "  Debug: Found $count $bundle media entities" >&2
        if [[ "$count" =~ ^[1-9] ]]; then
            export_content "media" "$bundle" "$DEMO_CONTENT_DIR"
        fi
    fi
done

# Export menu links
echo ""
echo "=== EXPORTING MENU LINKS ==="
if drush ev "echo \Drupal::entityQuery('menu_link_content')->accessCheck(FALSE)->count()->execute();" 2>/dev/null | grep -q '^[1-9]'; then
    export_content "menu_link_content" "menu_link_content" "$DEMO_CONTENT_DIR"
fi

# Export taxonomy terms
echo ""
echo "=== EXPORTING TAXONOMY TERMS ==="
for bundle in $(drush ev "
    foreach (\Drupal::entityTypeManager()->getStorage('taxonomy_vocabulary')->loadMultiple() as \$vocab) {
        echo \$vocab->id() . PHP_EOL;
    }
" 2>/dev/null); do
    if [[ -n "$bundle" ]]; then
        export_content "taxonomy_term" "$bundle" "$DEMO_CONTENT_DIR"
    fi
done

# Export files
echo ""
echo "=== EXPORTING FILES ==="
count=$(drush ev "echo \Drupal::entityQuery('file')->accessCheck(FALSE)->count()->execute();")
echo "  Debug: Found $count file entities" >&2
if [[ "$count" =~ ^[1-9] ]]; then
    export_content "file" "file" "$DEMO_CONTENT_DIR"
fi

echo ""
echo "=== EXPORT SUMMARY ==="
echo "Demo Content exported to: $DEMO_CONTENT_DIR"
echo "Layout Builder Demo exported to: $LAYOUT_BUILDER_DIR"
echo ""
echo "Content exported:"
echo "- Block Content: $(find "$DEMO_CONTENT_DIR/block_content" -name "*.yml" 2>/dev/null | wc -l) files"
echo "- Nodes (demo): $(find "$DEMO_CONTENT_DIR/node" -name "*.yml" 2>/dev/null | wc -l) files"
echo "- Nodes (layout builder): $(find "$LAYOUT_BUILDER_DIR/node" -name "*.yml" 2>/dev/null | wc -l) files"
echo "- Media: $(find "$DEMO_CONTENT_DIR/media" -name "*.yml" 2>/dev/null | wc -l) files"
echo "- Menu Links: $(find "$DEMO_CONTENT_DIR/menu_link_content" -name "*.yml" 2>/dev/null | wc -l) files"
echo "- Taxonomy Terms: $(find "$DEMO_CONTENT_DIR/taxonomy_term" -name "*.yml" 2>/dev/null | wc -l) files"
echo "- File Entities: $(find "$DEMO_CONTENT_DIR/file" -name "*.yml" 2>/dev/null | wc -l) files"
echo "- Physical Files: $(find "$DEMO_CONTENT_DIR/file" -type f ! -name "*.yml" 2>/dev/null | wc -l) files"
echo ""
echo "Export completed!"

# Make sure the script user owns the exported files
echo "Setting permissions on exported files..."
chown -R $(whoami):$(whoami) "$DEMO_CONTENT_DIR" "$LAYOUT_BUILDER_DIR" 2>/dev/null || true

echo "Great Lakes content export finished successfully!"
