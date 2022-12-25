/**
 * IWS - Geo Form Fields 
 * Version: 1.0
 */

jQuery(document).ready(function(){
    let countryField = jQuery('form').find(jQuery('[id*=country]'))[0]; 
    let stateField = jQuery('form').find(jQuery('[id*=state]'))[0];
    let cityField = jQuery('form').find(jQuery('[id*=city]'))[0];

    
    /**
     * If Country field is there in form and its is a 'select' element, fetch all Countries
     * If Country field is there in form and its type is 'text', fetch all Countries on keyup event
     */
    if(countryField != undefined){
        if(countryField.type == "select-one"){
            iws_gff_fetch_countries(countryField);
        }else if(countryField.type == "text"){
            jQuery(countryField).keyup(function(){
                var input = jQuery(countryField).val();
                if(!(input.length < 1)){
                    iws_gff_fetch_countries(countryField, input);
                }else{
                    iws_remove_country_list();
                }
            });
        }
    }

    /**
     * If State Field is there in form and its type is 'text'
     * fetch states on keyup event
     */
    if(stateField != undefined){
        if(stateField.type == "text"){
            jQuery(stateField).keyup(function(){
                var input = jQuery(stateField).val();
                if(!(input.length < 1)){
                    iws_gff_fetch_states(stateField, selectedCountryId, input);
                }else{
                    iws_remove_state_list();
                }
            });
        }else if(stateField.type == "select-one"){
            stateField.innerHTML = "<option disabled selected>Select "+iwsGeoLabels.country+" First</option>";
        }
    }

    /**
     * If City Field is there in form and its type is 'text'
     * fetch cities on keyup event
     */
    if(cityField != undefined){
        if(cityField.type == "text"){
            jQuery(cityField).keyup(function(){
                var input = jQuery(cityField).val();
                if(!(input.length < 1)){
                    iws_gff_fetch_cities(cityField, selectedStateId, input);
                }else{
                    iws_remove_city_list();
                }
            });
        }else if(cityField.type == "select-one"){
            cityField.innerHTML = "<option disabled selected>Select "+iwsGeoLabels.state+" First</option>";
        }
    }

    /**
     * Remove the country list and warning text from DOM 
     */
    function iws_remove_country_list(){
        jQuery('#iws_country_list').remove();
        jQuery('#iws-sure-is-country').remove();
    }
    /**
     * Remove the state list and warning text from DOM 
     */
     function iws_remove_state_list(){
        jQuery('#iws_state_list').remove();
        jQuery('#iws-sure-is-state').remove();
    }
    /**
     * Remove the city list and warning text from DOM 
     */
     function iws_remove_city_list(){
        jQuery('#iws_city_list').remove();
        jQuery('#iws-sure-is-city').remove();
    }

    /**
     * Initialize the click and change event on country list
     * If country field is select field then bind change event
     * If country field is text field then bind click event
     * And Fetch States from database
     */
    function iws_event_on_countries_list(){
        if(countryField.type == "select-one"){
            jQuery('#'+countryField.id).change(function(){
                selectedCountryId = jQuery(this).find(':selected').data('id');
                if(stateField != undefined && stateField.type == "select-one"){
                    iws_gff_fetch_states(stateField, selectedCountryId);
                    if(cityField != undefined && cityField.type == "select-one"){
                        cityField.innerHTML = "<option class='iws_city' vlaue='none' data-id='0' selected disabled>Select "+iwsGeoLabels.state+" first</option>";
                    }
                }
            });
        }else if(countryField.type == "text"){
            jQuery('.iws_country').click(function(){
                var input = jQuery(this).text();
                selectedCountryId = jQuery(this).data('id');
                countryField.value = input;
                iws_remove_country_list();
                if(stateField != undefined && stateField.type == "select-one"){
                    iws_gff_fetch_states(stateField, selectedCountryId);
                    if(cityField != undefined && cityField.type == "select-one"){
                        cityField.innerHTML = "<option class='iws_city' vlaue='none' data-id='0' selected disabled>Select "+iwsGeoLabels.state+" first</option>";
                    }
                }
                iws_remove_country_list();
            });
        }
    }

    /**
     * Initialize the click event on state list
     * If state field is select field then bind change event
     * If state field is text field then bind click event
     * And Fetch Cities from database
     */
    function iws_init_event_on_states(){
        if(stateField.type == "select-one"){
            jQuery('#'+stateField.id).change(function(){
                selectedStateId = jQuery(this).find(':selected').data('id');
                if(cityField != undefined && cityField.type == "select-one"){
                    iws_gff_fetch_cities(cityField, selectedStateId);
                }
            });
        }else if(stateField.type == "text"){
            jQuery('.iws_state').click(function(){
                var input = jQuery(this).text();
                selectedStateId = jQuery(this).data('id');
                stateField.value = input;
                iws_remove_state_list();
                if(cityField != undefined && cityField.type == "select-one"){
                    iws_gff_fetch_cities(cityField, selectedStateId);
                }
                iws_remove_state_list();
            });
        }
    }

    /**
     * Initialize the click event on city list
     * If city field is text field then bind click event
     * Remove the city list on click on one city
     */
     function iws_init_event_on_cities(){
        if(cityField.type == "text"){
            jQuery('.iws_city').click(function(){
                var input = jQuery(this).text();
                selectedCityId = jQuery(this).data('id');
                cityField.value = input;
                iws_remove_city_list();
            });
        }
     }


    /* --------------- FETCH FROM DB ----------------- */

    /**
     * Fetch countries from database and place inside elementor form
     * Takes first html form element which has 'country' as substring in its id attribute 
     * @param {Object} countryField
     * @param {String} input
     * @returns {DOM} HTML markup of Countries list 
     */
    function iws_gff_fetch_countries(countryField, input = ''){
        if(countryField.type != "select-one" && countryField.type != "text"){
            return;
        }
    
        var data = new FormData();
        data.append('action', 'iws_gff_fetch_countries');
        data.append('fetch_for', countryField.type);
        if(input != ''){
            data.append('country_name', input);
        }
    
        jQuery.ajax({
            url: ajaxUrl,
            type: 'post',
            data: data,
            contentType: false,
            processData: false,
            success: function(responce){
                responce = JSON.parse(responce);
                if(countryField.type == 'select-one'){
                    countryField.innerHTML = responce.html; // add option elements
                }else if(countryField.type == 'text'){
                    iws_remove_country_list();  // Remove the previous country list
                    jQuery(responce.html).insertAfter(countryField);  // insert country list after text input field
                }
                iws_event_on_countries_list();
            },
            error: function(responce, msg){
                countryField.innerHTML = '<option>'+msg+': '+responce.status+' "Try reloading the page!"</option>';
            }
        });
    }

    /**
     * Fetch states from database and place inside elementor form
     * Takes first html form element which has 'state' as substring in its id attribute 
     * @param {Object} stateField HTML field that has states as id 
     * @param {int} country_id selected country ID
     * @param {string} state_name if user is typing the state name
     * @returns {DOM} HTML markup of states list 
     */
    function iws_gff_fetch_states(stateField, country_id, state_name = ''){
        if(stateField.type != "select-one" && stateField.type != "text"){
            return;
        }
        if(country_id == ''){
            country_id = selectedCountryId;
        }
    
        var data = new FormData();
        data.append('action', 'iws_gff_fetch_states');
        data.append('country_id', country_id);
        data.append('fetch_for', stateField.type);
        if(state_name != ''){
            data.append('state_name', state_name);
        }
    
        jQuery.ajax({
            url: ajaxUrl,
            type: 'post',
            data: data,
            contentType: false,
            processData: false,
            success: function(responce){
                responce = JSON.parse(responce);
                if(stateField.type == 'select-one'){
                    stateField.innerHTML = responce.html; // add option elements
                    if(responce.status == 404){
                        stateField.disabled = true;
                        if(cityField != undefined){ // check if city field is present of not
                            if(cityField.type == 'select-one'){
                                cityField.innerHTML = "<option class='iws_city' vlaue='none' data-id='0' selected disabled>No "+iwsGeoLabels.city+" Found</option>";
                                cityField.disabled = true;
                            }else if(cityField.type == 'text'){
                                cityField.innerHTML = "<p class='iws_city' data-id='0'>No "+iwsGeoLabels.city+" Found</p>";
                                cityField.disabled = true;
                            }
                        }
                    }else{
                        stateField.disabled = false;
                        if(cityField != undefined){
                            cityField.disabled = false;
                        }
                    }
                }else if(stateField.type == 'text'){
                    iws_remove_state_list();  // Remove the previous state list
                    jQuery(responce.html).insertAfter(stateField);  // insert state list after text input field
                    if(responce.status == 404){
                        // stateField.disabled = true;
                        if(cityField != undefined){
                            if(cityField.type == 'select-one'){
                                cityField.innerHTML = "<option class='iws_city' vlaue='none' data-id='0' selected disabled>No "+iwsGeoLabels.city+" Found</option>";
                                cityField.disabled = true;
                            }else if(cityField.type == 'text'){
                                cityField.innerHTML = "<p class='iws_city' data-id='0'>No "+iwsGeoLabels.city+" Found</p>";
                                cityField.disabled = true;
                            }
                        }
                    }else{
                        stateField.disabled = false;
                        if(cityField != undefined){
                            cityField.disabled = false;
                        }
                    }
                }
                iws_init_event_on_states();
            },
            error: function(responce, msg){
                stateField.innerHTML = '<option>'+msg+': '+responce.status+' "Try reloading the page!"</option>';
            }
        });
    }

    /**
     * Fetch cities from database and place inside elementor form
     * Takes first html form element which has 'city' as substring in its id attribute 
     * @param {Object} cityField HTML field that has city as id 
     * @param {int} state_id selected state ID 
     * @param {string} city_name if user is typing the city name 
     * @returns {DOM} HTML markup of city list 
     */
     function iws_gff_fetch_cities(cityField, state_id, city_name = ''){
        if(cityField.type != "select-one" && cityField.type != "text"){
            return;
        }
        if(state_id == ''){
            state_id = selectedStateId;
        }
    
        var data = new FormData();
        data.append('action', 'iws_gff_fetch_cities');
        data.append('state_id', state_id);
        data.append('fetch_for', cityField.type);
        if(city_name != ''){
            data.append('city_name', city_name);
        }
    
        jQuery.ajax({
            url: ajaxUrl,
            type: 'post',
            data: data,
            contentType: false,
            processData: false,
            success: function(responce){
                responce = JSON.parse(responce);
                if(cityField.type == 'select-one'){
                    cityField.innerHTML = responce.html; // add option elements
                }else if(cityField.type == 'text'){
                    iws_remove_city_list();  // Remove the previous state list
                    jQuery(responce.html).insertAfter(cityField);  // insert state list after text input field
                }
                iws_init_event_on_cities();
            },
            error: function(responce, msg){
                cityField.innerHTML = '<option>'+msg+': '+responce.status+' "Try reloading the page!"</option>';
            }
        });
    }

});