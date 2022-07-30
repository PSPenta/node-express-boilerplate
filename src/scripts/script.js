/* eslint-disable no-console */
(async () => {
  try {
    const cliArguments = process.argv.slice(2);
    console.log(cliArguments);
  } catch (error) {
    console.error(error);
  }
})();
