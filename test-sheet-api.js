const { GoogleSpreadsheet } = require('google-spreadsheet');
console.log("Docs sheetsByTitle exists?", Object.getOwnPropertyDescriptor(GoogleSpreadsheet.prototype, 'sheetsByTitle') ? "Yes" : "No");
