module.exports = async (page, scenario, vp) => {
  console.log('SCENARIO > ' + scenario.label);

   // Ensure all images loaded before doing the screenshot
  page.evaluate(async () => {
    document.querySelectorAll('[loading="lazy"]').forEach((element) => {
      element.loading = 'eager';
    });

    document.querySelectorAll('[decoding="async"]').forEach((element) => {
      element.decoding = 'sync';
    });
  });

  await require('./clickAndHoverHelper')(page, scenario);


};
