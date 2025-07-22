import * as utils from './app.js';

$(document).ready( async function () {

    const profirciencyData = await utils.getCodeStats();

    $("#proficiency-data").html(profirciencyData.Data);
    $("#lblLiveTracking").html(`Live tracking since ${profirciencyData.StartDate}`);
});