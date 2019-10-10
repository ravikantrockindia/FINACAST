({
    prevYearlyInterest : function(component) {
        var tabledata = component.get("v.Tabledata");
        tabledata = JSON.parse(tabledata);
        var viewingOption=component.get("v.futureselectedValue");
        console.log('viewingOption2'+viewingOption);
        var objectDisplay ='';
        if(viewingOption=='buy'){
            objectDisplay=tabledata.simulationData.avatarData;
        }else if(viewingOption=='nobuy'){
            objectDisplay=tabledata.simulationData.profileData;
        }else if(viewingOption=='recommend'){
            objectDisplay=tabledata.simulationData.recommendData;
        }
        
        var offset = objectDisplay.offset;
        var shortTermYearlyInterest = component.get("v.shortTermYearlyInterest");
        var currentDebtsAnalysisYear = component.get("v.year");
        
        var decide = 'prev';
        var currentDebtsAnalysisYear;
        var debtsAnalysisYear;
        var longtermInterest;
        var shorttermInterest;
        
        //parse interest rates if previous year
        if(decide=='prev') {
            currentDebtsAnalysisYear--;
            if(currentDebtsAnalysisYear>=offset) {
                debtsAnalysisYear = (currentDebtsAnalysisYear);
                longtermInterest = (parseFloat(objectDisplay.debtAnalysis.yearlyData[currentDebtsAnalysisYear-offset].interestOnTermDebt));
                shorttermInterest = (parseFloat(shortTermYearlyInterest[currentDebtsAnalysisYear-offset]));
                component.set("v.year", currentDebtsAnalysisYear);
            }
        }
        
        component.set("v.longTermLoans", Math.round(longtermInterest));
        component.set("v.shortTermLoans",Math.round(shorttermInterest));
    },
    
        nextYearlyInterest : function(component) {
        var shortTermYearlyInterest = component.get("v.shortTermYearlyInterest");   
        var currentDebtsAnalysisYear = component.get("v.year");
        var tabledata = component.get("v.Tabledata");
        tabledata = JSON.parse(tabledata);
        var viewingOption=component.get("v.futureselectedValue");
        console.log('viewingOption2'+viewingOption);
        var objectDisplay ='';
        if(viewingOption=='buy'){
            objectDisplay=tabledata.simulationData.avatarData;
        }else if(viewingOption=='nobuy'){
            objectDisplay=tabledata.simulationData.profileData;
        }else if(viewingOption=='recommend'){
            objectDisplay=tabledata.simulationData.recommendData;
        }
        var offset = objectDisplay.offset;        
        var decide = 'next';
        
        var currentDebtsAnalysisYear;        
        var debtsAnalysisYear;
        var longtermInterest;
        var shorttermInterest;      
        
        if(decide=='next') {
            currentDebtsAnalysisYear++;
            if(currentDebtsAnalysisYear<=(offset+9)) {
                debtsAnalysisYear = currentDebtsAnalysisYear;
                longtermInterest = (parseFloat(objectDisplay.debtAnalysis.yearlyData[currentDebtsAnalysisYear-offset].interestOnTermDebt));
                shorttermInterest = (parseFloat(shortTermYearlyInterest[currentDebtsAnalysisYear-offset]));
                component.set("v.year", currentDebtsAnalysisYear);
            } else {
                var event = $A.get("e.force:showToast");
                event.setParams({ "type" : "Error", "title" : "Info !", "message" : "Sorry can not display year data." });
                event.fire();
                currentDebtsAnalysisYear--;
                longtermInterest = component.get("v.longTermLoans");
                shorttermInterest = component.get("v.shortTermLoans");
            }
        }
        
        component.set("v.longTermLoans", Math.round(longtermInterest));
        component.set("v.shortTermLoans", Math.round(shorttermInterest));
    },
    
    generateChart : function(component, event, helper) {

        var offset;

                var tabledata = component.get("v.Tabledata");
                tabledata = JSON.parse(tabledata);
                
                var viewingOption=component.get("v.futureselectedValue");
                console.log('viewingOption1'+viewingOption);
                var objectDisplay ='';
                if(viewingOption=='buy'){
                    objectDisplay=tabledata.simulationData.avatarData;
                }else if(viewingOption=='nobuy'){
                    objectDisplay=tabledata.simulationData.profileData;
                }else if(viewingOption=='recommend'){
                    objectDisplay=tabledata.simulationData.recommendData;
                }
                offset = objectDisplay.offset;
                component.set("v.year", offset);
                

                var d1 = new Array();
                var chartLabels = new Array();
                var chartDataSet = new Array();
                var shortTermYearlyInterest = new Array();
                var debtList = new Array();
                var debtList2 = new Array();
                var dataSeriesDebt = new Array();
                var selected ="All";
                var flag = true;
                var tempArray;
                var startYear = 0;
                var endYear = -1;

            var longtermInterest;
            var shorttermInterest;
            var currentDebtsAnalysisYear = component.get("v.year");
            console.log('currentDebtsAnalysisYear '+ currentDebtsAnalysisYear);
            
            if(!$A.util.isUndefinedOrNull(objectDisplay.debtAnalysis.yearlyData[currentDebtsAnalysisYear-offset].interestOnTermDebt))  
                longtermInterest = (parseFloat(objectDisplay.debtAnalysis.yearlyData[currentDebtsAnalysisYear-offset].interestOnTermDebt));
            else longtermInterest = 0;
            
            if(!$A.util.isUndefinedOrNull(shortTermYearlyInterest[currentDebtsAnalysisYear-offset]))
                shorttermInterest = (parseFloat(shortTermYearlyInterest[currentDebtsAnalysisYear-offset]));
            else shorttermInterest = 0;
            
            if(isNaN(longtermInterest)){
                longtermInterest = 0;
            }
            if(isNaN(shorttermInterest)) {
                shorttermInterest = 0;
            }
            component.set("v.longTermLoans", Math.round(longtermInterest));
            component.set("v.shortTermLoans", Math.round(shorttermInterest));

            
            var moneyOwned = 0;
            var moneytobepaid = 0;   
            if($A.util.isUndefinedOrNull(tabledata) != true) {
            //    offset = data.offset;
                offset = objectDisplay.offset;
                for(var i=startYear; i<objectDisplay.debtAnalysis.yearlyData.length; i++) {
                    
                    shortTermYearlyInterest[i] = objectDisplay.debtAnalysis.yearlyData[i].interestOnDebt;    
                    tempArray = objectDisplay.debtAnalysis.yearlyData[i].monthlyDebts[(objectDisplay.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
                    for(var j=0; j<tempArray.length; j++) {
                        for(var k=0; k<dataSeriesDebt.length; k++) { 
                            if(tempArray[j].name == dataSeriesDebt[k].label && (selected == 'All' || selected == dataSeriesDebt[k].label)){
                                if(tempArray[j].item.termDebt && tempArray[j].item.defaultedItem != undefined && tempArray[j].item.defaultedItem != null){
                                    dataSeriesDebt[k].objectDisplay.push([(offset+i), (tempArray[j].item.currentValue+tempArray[j].item.defaultedItem.currentValue)]);
                                    flag = false;
                                    endYear = i;
                                    break;
                                } else {
                                    dataSeriesDebt[k].objectDisplay.push([(offset+i), tempArray[j].item.currentValue]);
                                    flag = false;
                                    endYear = i;
                                    break;
                                }
                            }
                        }
                        if(flag) {
                            if (typeof(debtList2[tempArray[j].name]) == 'undefined') {
                                debtList.push({count: 1, name:tempArray[j].name});
                                debtList2[tempArray[j].name] = 1;
                            }
                            if(selected == 'All' || selected == tempArray[j].name) {
                                d1 = new Array();
                                if(tempArray[j].item.termDebt && tempArray[j].item.defaultedItem != undefined && tempArray[j].item.defaultedItem != null){
                                    d1.push([(offset+i), (tempArray[j].item.currentValue+tempArray[j].item.defaultedItem.currentValue)]);
                                } else {
                                    d1.push([(offset+i), tempArray[j].item.currentValue]);
                                }
                                dataSeriesDebt.push({objectDisplay: d1, bars: {barWidth: 0.3, align:"center", show:true}, stack:true, shadowSize: 0, label: tempArray[j].name});
                                endYear = i;
                            }
                        }
                        flag = true;  
                    }
                }
                
               
                component.set("v.shortTermYearlyInterest", shortTermYearlyInterest);
                //console.log('abc---'+component.get("v.shortTermYearlyInterest"));
                //make chart Label and set points
               var dataPoints1=new Array();
                if($A.util.isUndefinedOrNull(dataSeriesDebt[0]) != true) {
                    for(var i = 0; i<dataSeriesDebt.length; i++)
                    {
                         var dataPoints=new Array();
                        //chartLabels[i] = dataSeriesDebt[0]["objectDisplay"][i][0];
                       // chartDataSet[i] = dataSeriesDebt[0]["objectDisplay"][i][1];
                       moneyOwned += Math.floor(parseFloat(chartDataSet[i]));
                         moneytobepaid = Math.floor(parseFloat(chartDataSet[9]));
                        if(isNaN(moneytobepaid)){
                            moneytobepaid =0;
                        }
                          for(var j=0;j<dataSeriesDebt[i].objectDisplay.length;j++){
                            dataPoints.push({x: new Date(dataSeriesDebt[i].objectDisplay[j][0], 0) , y:dataSeriesDebt[i].objectDisplay[j][1]});
                        }
                        
                        var d = { type: "stackedColumn", toolTipContent: " {label} $: {y}", showInLegend:true,name:dataSeriesDebt[i].label, label:dataSeriesDebt[i].label ,yValueFormatString: "#,##0,.##K",dataPoints:dataPoints };
                        dataPoints1.push(d); 
                    }
                }
                component.set("v.moneyOwned",moneyOwned.toLocaleString());
                component.set("v.moneytobepaid",moneytobepaid.toLocaleString());
              //  console.log('moneytobepaid---'+moneytobepaid);
             //  console.log('chartDataSet'+chartDataSet);
               
                var dps=new Array();
                for(var i=0; i<chartLabels.length; i++){
                    dps.push({x: new Date(chartLabels[i], 0) , y: chartDataSet[i], color: "skyblue"});
                }
                var chart = new CanvasJS.Chart("chartContainer3.29", {
            animationEnabled: true,
            title:{
                //text: "Debt Forecast",
                fontFamily: "arial black",
                fontColor: "#695A42"
            },
            dataPointWidth: 35,
            axisX: {
                interval: 1,
                intervalType: "year"
            },
            axisY:{
            //    valueFormatString:"#0K",
                gridColor: "#ffffff",
                tickColor: "#ffffff"
            },
            toolTip:{
                contentFormatter: function ( e ) {
                    var value = e.entries[0].dataPoint.y;
                    if(value > 999)
                    return Math.abs(value) > 999 ? Math.sign(value)*((Math.abs(value)/1000).toFixed(1)) + 'K' : Math.sign(value)*Math.abs(value)
                    else if(value < 10000000)
                     return Math.abs(value) > 999 ? Math.sign(value)*((Math.abs(value)/10000000).toFixed(1)) + 'M' : Math.sign(value)*Math.abs(value)
                      else if(value < 1000000000000)
                           return Math.abs(value) > 999 ? Math.sign(value)*((Math.abs(value)/1000000000000).toFixed(1)) + 'B' : Math.sign(value)*Math.abs(value)
                }  
            },
            data:dataPoints1/* [{
               yValueFormatString: "$ #,### ",
                    //xValueFormatString: "MM YYYY",
                    type: "stackedColumn",
                    dataPoints: dps
            },
                   {        
                       type: "stackedColumn",
                       showInLegend: true,
                       name: "Credit Cards",
                       color: "#48bcc7",
                       dataPoints: [
                           { y: 6.82, x: new Date(2010,0) },
                           { y: 9.02, x: new Date(2011,0) },
                           { y: 11.80, x: new Date(2012,0) },
                           { y: 14.11, x: new Date(2013,0) },
                           { y: 15.96, x: new Date(2014,0) },
                           { y: 17.73, x: new Date(2015,0) },
                           { y: 21.5, x: new Date(2016,0) }
                       ]
                   },
                   {        
                       type: "stackedColumn",
                       showInLegend: true,
                       name: "Morgage Loans",
                       color: "#508553",
                       dataPoints: [
                           { y: 7.28, x: new Date(2010,0) },
                           { y: 9.72, x: new Date(2011,0) },
                           { y: 13.30, x: new Date(2012,0) },
                           { y: 18.9, x: new Date(2013,0) },
                           { y: 8.10, x: new Date(2014,0) },
                           { y: 18.68, x: new Date(2015,0) },
                           { y: 2.45, x: new Date(2016,0) }
                       ]
                   },
                   {        
                       type: "stackedColumn",
                       showInLegend: true,
                       name: "Medical Loans",
                       color: "#85d689",
                       dataPoints: [
                           { y: 8.44, x: new Date(2010,0) },
                           { y: 10.58, x: new Date(2011,0) },
                           { y: 14.41, x: new Date(2012,0) },
                           { y: 6.86, x: new Date(2013,0) },
                           { y: 17.64, x: new Date(2014,0) },
                           { y: 26.32, x: new Date(2015,0) },
                           { y: 6.06, x: new Date(2016,0) }
                       ]
                   },
                   {        
                       type: "stackedColumn",
                       showInLegend: true,
                       name: "Car Loans",
                       color: "#084d0b",
                       dataPoints: [
                           { y: 7.28, x: new Date(2010,0) },
                           { y: 9.72, x: new Date(2011,0) },
                           { y: 13.30, x: new Date(2012,0) },
                           { y: 14.9, x: new Date(2013,0) },
                           { y: 18.10, x: new Date(2014,0) },
                           { y: 18.68, x: new Date(2015,0) },
                           { y: 22.45, x: new Date(2016,0) }
                       ]
                   }
                   ]*/
                   });
                   chart.render();
            }
            
          

        
                   }
                   
                   
                   })