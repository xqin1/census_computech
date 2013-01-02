jQuery(document).ready(function () {
	jQuery('#link-about').click(function(e){
		e.preventDefault();
		jQuery('#title').text('About');
		jQuery('#introText').show();
		jQuery("#subTitle, #data-charts").hide();
		jQuery(this).hide();
	});
	 // Share links
    jQuery('a.link-pop').click(function (e){
        e.preventDefault();
        if(jQuery(this).hasClass('active')) {
            jQuery('#share div').css('display', 'none');
            jQuery(this).removeClass('active');
        } else {
            jQuery(this).addClass('active');
            jQuery('#share div').css('display', 'block');
        }
    });
    

  // Contextual layer switching
  jQuery('ul.macro li a').click(function(e) {
      e.preventDefault();
			
			if (this.id == 'state'){
          activeLayers = [
             'state_demographics'
          ];
      }
      if (this.id == 'county'){
          activeLayers = [
              'county_demographics'
          ];
      }
      if (this.id == 'msa'){
          activeLayers = [
              'msa_demographics'
          ];
      }
      if (this.id == 'tribal'){
          activeLayers = [
              'tribal_demographics'
          ];
      }
      if (this.id == 'congdist'){
          activeLayers = [
              'congdist_demographics'
          ];
      }
      jQuery('ul.macro li a').removeClass('active');
      jQuery(this).addClass('active');
     
      layers = [
          activeLayers
      ];
			jQuery('#title').text('About');
			jQuery('#introText').show();
			jQuery("#subTitle, #link-about, #data-charts").hide();
      layers = layers.join(',');
      refreshMap();
  });
  
  jQuery('form.location-search').submit(function (e){
      e.preventDefault();
      var inputValue = input.val(),
      encodedInput = encodeURIComponent(inputValue);
      geocode(encodedInput);
  });
  
});

	var raceData = [];
	var ageData = [];
	var incomeData = [];	

   var interaction;
    // Define the layers and other map variables
    var layers = [
        'state_demographics'
        ],
        //cleanLayers;
        //cleanLayers = $.compact(layers);
        layers = layers.join(',');
        var urlBase = jQuery.map(['a','b','c','d'],function(sub) {
          return 'http://' + sub + '.tiles.mapbox.com/computech/1.0.0/'+layers+'/';
          //a.tiles.mapbox.com/fcc/1.0.0/800-mhz-cellular-a-block-cgsa/layer.json
        }),
        mm = com.modestmaps,
        m, test;

    // Update tiles array
    function getTiles() {
      return jQuery.map(urlBase, function(base) {
        return base + '{z}/{x}/{y}.png';
      });
    };

    // Update grid array
    function getGrids() {
      return jQuery.map(urlBase, function(base) {
        return base + '{z}/{x}/{y}.grid.json';
      });
    };

    // Refresh Map
    function refreshMap() {
        urlBase = jQuery.map(['a','b','c','d'],function(sub) {
        	  return 'http://' + sub + '.tiles.mapbox.com/computech/1.0.0/'+layers+'/';
        });
        wax.tilejson(urlBase[0]+'layer.json', function(tilejson) {
            tilejson.minzoom = 3;
            tilejson.maxzoom = 10;
            tilejson.tiles = getTiles();
            tilejson.grids = getGrids();
            // remove embedded styles to prevent web font flickers
           // tilejson.formatter = tilejson.formatter.replace(/<style(.*?)style>/gi,'');
            //jQuery('#tooltips').hide();
            interaction.remove();
            interaction = wax.mm.interaction(m, tilejson,{callbacks: myTooltip,clickAction: ['full', 'teaser', 'location']});
            m.setProvider(new wax.mm.connector(tilejson));
        });
    }

    function mapChange() {
        if (!jQuery('#a-block').hasClass('active')) {
            jQuery('#b-block').removeClass('active');
            jQuery('#a-block').addClass('active');

            layers = [
                    800-mhz-cellular-a-block-cgsa
            ];
            cleanLayers = $.compact(layers);
            layers = cleanLayers.join(',');
            refreshMap();
        }
        else{
        	 jQuery('#a-block').removeClass('active');
             jQuery('#b-block').addClass('active');

             layers = [
                     800-mhz-cellular-b-block-cgsa
             ];
             cleanLayers = $.compact(layers);
             layers = cleanLayers.join(',');
             refreshMap();
        }
    }

    // Send address to MapQuest's Nominatim search
    function geocode(query) {
    	//console.log(query);
        loading();
        $.ajax({
            url: 'http://open.mapquestapi.com/nominatim/v1/search?format=json&json_callback=callback&countrycodes=us&limit=1&q=' + query,
            type: 'jsonp',
            jsonpCallback: 'callback',
            success: function (value) {
                value = value[0];
                jQuery('.loading').remove();
                if (value === undefined) {
                    errorBox('<p>The search you tried did not return a result.</p>');
                } else {
                    if (value.type == 'state' || value.type == 'county' || value.type == 'maritime'  || value.type == 'country') {
                        easey.slow(m, {
                            location: new mm.Location(value.lat, value.lon),
                            zoom: 6,
                            time: 2000
                        });
                    } else {
                        easey.slow(m, {
                            location: new mm.Location(value.lat, value.lon),
                            zoom: 8,
                            time: 2000
                        });
                    }
                    jQuery('.error').remove();
                }
            }
        });
    }

    // Show error message
    function errorBox(reason) {
      jQuery('form.location-search').append('<div class="error">' + reason + '<a href="#" class="close">x</a><div>');
      jQuery('a.close').click(function(e) {
        e.preventDefault();
        jQuery('.error').remove();
      });
    }

    // Show loading image
    function loading() {
      jQuery('body').append('<div class="loading"><img src="img/loader.gif" alt="loading" /></div>');
    }
    
    function numberWithCommas(x) {
    	if (x != null && typeof (x) != 'undefined') {
    		return x.toString().replace(/\B(?=(?:\d{3})+(?!\d))/g, ",");
    	} else {
    		return "0";
    	}

    }

    // Set up tilejson object of map settings
    wax.tilejson(urlBase[0]+'layer.json', function(tilejson) {
      tilejson.tiles = getTiles();
      tilejson.grids = getGrids();
      tilejson.minzoom = 3;
      tilejson.maxzoom = 10;

      // Build the map
      m = new mm.Map('map',
        new wax.mm.connector(tilejson),
        null,
        [
          new mm.MouseHandler(),
          new mm.TouchHandler()
        ]
      );   
      m.setCenterZoom(new mm.Location(39, -95), 4);
      myTooltip = new wax.tooltip;
      myTooltip.getTooltip = function(feature, context) {
    	  jQuery('#introText').hide();
				jQuery("#link-about, #subTitle, #data-charts").show();
    	  feature=feature.split("<br/>");
    	  jQuery("#about-heading h2").text(feature[0]);
    	  jQuery("#about-heading h3 span").text(feature[1]);
    	  jQuery("#about-body dd").eq(0).text(numberWithCommas(feature[2]));
    	  jQuery("#about-body dd").eq(1).text(numberWithCommas(feature[3]));
    	  jQuery("#about-body dd").eq(2).text(numberWithCommas(parseFloat(feature[4]).toFixed(0)));
    	  jQuery("#about-body dd").eq(3).text(numberWithCommas(parseFloat(feature[5]).toFixed(0)));
    	  jQuery("#about-body dd").eq(4).text("$" + numberWithCommas(parseFloat(feature[6]).toFixed(0)));
				
				raceData = [
							{ label: "Asian",  data: parseFloat(feature[7])},
							{ label: "Black",  data: parseFloat(feature[8])},
							{ label: "Hispanic",  data: parseFloat(feature[9])},
							{ label: "Native American",  data: parseFloat(feature[10])},
							{ label: "White",  data: parseFloat(feature[11])}
						];
						
				ageData = [
							{ label: "< 5",  data: parseFloat(feature[12])},
							{ label: "5-19",  data: parseFloat(feature[13])},
							{ label: "20-34",  data: parseFloat(feature[14])},
							{ label: "35-60",  data: parseFloat(feature[15])},
							{ label: "> 60",  data: parseFloat(feature[16])}
						];
						
				incomeData = [
							{ label: "< $25,000",  data: parseFloat(feature[17])},
							{ label: "$25 - 50,000",  data: parseFloat(feature[18])},
							{ label: "$50 - 100,000",  data: parseFloat(feature[19])},
							{ label: "$100 - 250,000",  data: parseFloat(feature[20])},
							{ label: "> $250,000",  data: parseFloat(feature[21])}
						];
				
				// Populate Education horizontal bar graph
				jQuery(".hBarChart dd").eq(0).find('.hBar').css("width", feature[22]*100 +"%");
				jQuery(".hBarChart dd").eq(0).find('.hBarLabel').text(parseFloat(feature[22]*100).toFixed(1) + "%");
				jQuery(".hBarChart dd").eq(1).find('.hBar').css("width", feature[23]*100 +"%");
				jQuery(".hBarChart dd").eq(1).find('.hBarLabel').text(parseFloat(feature[23]*100).toFixed(1) + "%");
				
				// Generate the pie charts
				showChart();
    	  /*for (i=0;i<feature.length;i++){
    		  console.log(feature[i])
    	  }*/

      }
    
      interaction = wax.mm.interaction(m, tilejson, {callbacks: myTooltip,clickAction: ['full', 'teaser', 'location']});
      m.addCallback("drawn", function (m) {
        b.setCenterZoom(m.getCenter(), m.getZoom());
      });
      m.setProvider(new wax.mm.connector(tilejson));
   wax.mm.attribution(m, tilejson).appendTo(m.parent);
   wax.mm.zoomer(m, tilejson).appendTo(jQuery('#controls')[0]);
   wax.mm.bwdetect(m, {
       auto: true,
       png:'.png64?'
   });
    });   

     

    // Handle geocoder form submission
    var input = jQuery('.location-search input[type=text]');
        inputTitle = 'Enter a place or zip code';
        input.val(inputTitle);   

    // Remove default val on blur
    input.blur(function() {
	    if (input.val() === '') {
	        input.val(inputTitle);
	    }
	    }).focus(function() {
	        if (input.val() === inputTitle) {
	            input.val('');
	        }
    });



   
