function showChart(){

		// Race Pie Chart
		jQuery.plot(jQuery("#race"), raceData, 
		{
			series: {
				pie: { 
					label: {
						show: false
					},
					show: true,
					radius: '1'
				}
			},
			legend: {
				show: true,
				container: jQuery('#race-legend')
			}
		});
		
		// Append race data values to legend
		jQuery('#race-legend td.legendLabel').each(function(index){
			var col3 = '<td style="text-align: right; width: 50px;">' + (raceData[index].data*100).toFixed(1) + '%</td>';				
			jQuery(this).css('width','100px').after(col3);
		});
				
		// Age Pie Chart
		jQuery.plot(jQuery("#age"), ageData, 
		{
			series: {
				pie: { 
					label: {
						show: false
					},
					show: true,
					radius: '1'
				}
			},
			legend: {
				show: true,
				container: jQuery('#age-legend')
			}
		});
		
		// Append age data values to legend
		jQuery('#age-legend td.legendLabel').each(function(index){
			var col3 = '<td style="text-align: right; width: 50px;">' + (ageData[index].data*100).toFixed(1) + '%</td>';				
			jQuery(this).css('width','100px').after(col3);
		});
		
		// Income Pie Chart
		jQuery.plot(jQuery("#income"), incomeData, 
		{
			series: {
				pie: { 
					label: {
						show: false
					},
					show: true,
					radius: '1'
				}			
			},
			legend: {
				show: true,
				container: jQuery('#income-legend')
			}
		});	
		
		// Append income data values to legend
		jQuery('#income-legend td.legendLabel').each(function(index){
			var col3 = '<td style="text-align: right; width: 50px;">' + (incomeData[index].data*100).toFixed(1) + '%</td>';				
			jQuery(this).css('width','100px').after(col3);
		});
						
} // End showChart()