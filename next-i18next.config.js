const path = require("path");

module.exports = {
  i18n: {
    locales: ["default", "en", "mm"],
    defaultLocale: "default",
    localeDetection: false,
    localePath: path.resolve("./public/locales"),
  },
};