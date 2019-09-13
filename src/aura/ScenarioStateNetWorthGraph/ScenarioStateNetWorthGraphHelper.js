({

    
	 showNetworth : function(component) {
        var dataSeries = new Array();
        var yearlist = new Array();
        var yearlistdata = new Array();
        var networthArray=new Array();
        var length;
        var diagnosis = component.get("v.data");
        var offset = diagnosis.offset;
        var debtsArray=new Array();
        var savingsArray=new Array();
        var tempArray = new Array();
         try{
           // console.log("diag",diagnosis.netWorthAnalysis.yearlyData.length);
            for(var i=0; i<diagnosis.netWorthAnalysis.yearlyData.length; i++){
                    length = diagnosis.netWorthAnalysis.yearlyData[i].length;
                    yearlist.push(offset+i);
                                   networthArray.push([diagnosis.netWorthAnalysis.yearlyData[i][length-1]]);
                    yearlistdata.push(Math.floor(diagnosis.netWorthAnalysis.yearlyData[i][length-1]));
                }
                      var dps=new Array();
            for(var i=0; i<yearlist.length; i++){
                dps.push({x: new Date(yearlist[i], 0) , y: yearlistdata[i]});
            }
             //   for(var j=0; j<yearlistdata.length; j++){
             console.log(yearlist[i]);
            CanvasJS.addColorSet("greenShades",
                                 [//colorSet Array
                                     
                                     "#8eddfa",
                                     "#008080",
                                     "#90EE90"                
                                 ]);
            
            var chart = new CanvasJS.Chart("chartContainer0.966", {
                colorSet: "greenShades",
                animationEnabled: true,  
                title:{
                    //   text: "Networth Forecast"
                },
                axisX:{      
                    valueFormatString: "YYYY" ,
                    
                },
                axisY: {
                    //title: "Frequeny",
                    //valueFormatString: "#0,,.",
                  //  suffix: "M",
                    gridColor: "#dbdad5",
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
                data: [{
                    yValueFormatString: "$ #,### ",
                    //xValueFormatString: "MM YYYY",
                    type: "area",
                    dataPoints: dps
                        }]
                });
            var data = diagnosis;
            var yearlysum;
            for(var i=0; i<(data.debtAnalysis.yearlyData.length); i++) {
                tempArray = data.debtAnalysis.yearlyData[i].monthlyDebts[(data.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
                yearlysum=0;
                for(var j=0; j<tempArray.length; j++){
                    yearlysum+=tempArray[j].item.currentValue;
                }
                debtsArray.push(yearlysum);
            }
            for(var i=0; i<(data.yearlySavings.length); i++){
                savingsArray.push(data.yearlySavings[i]);
            }
            
            var objSavingArr=savingsArray;
            var objDebtArr=debtsArray;
            var objNetworthArr=networthArray;
            var objMainArr=data.netWorthAnalysis;
            var   currentNetWorthYear = offset;      
            // currentNetWorthYear++;
            if(currentNetWorthYear == offset){
                component.set("v.totalSavings",(Math.floor(parseFloat(objSavingArr[currentNetWorthYear-offset]))).toLocaleString());
                component.set("v.totalDebts",(Math.floor(parseFloat(objDebtArr[currentNetWorthYear-offset]))).toLocaleString());
                component.set("v.networth",(Math.floor(parseFloat(objNetworthArr[currentNetWorthYear-offset]))).toLocaleString());
                component.set("v.year", currentNetWorthYear);           
            }            
            
            //total networth
            var beginningProfileNetWorth = data.netWorthAnalysis.yearlyData[0][length-1];
            length = diagnosis.netWorthAnalysis.yearlyData[currentNetWorthYear-offset].length;
            var profileNetWorth = diagnosis.netWorthAnalysis.yearlyData[currentNetWorthYear-offset][length-1];
            var NetworthMessageJS ="Your net worth for the year "+currentNetWorthYear+" is " + Math.ceil((networthArray[0]));
            //console.log("NWM" + NetworthMessageJS);
            component.set("v.NetworthMessage", NetworthMessageJS);
             chart.render();
         }
         catch(e){
             console.log('Exception in nfa: '+ e.message);
         }
    },
    
     prevNetworth : function(component) {
        var debtsArray=new Array();
        var savingsArray=new Array();
        var tempArray = new Array();
        var data = component.get("v.data");
        var offset = data.offset;
        var currentNetWorthYear = component.get("v.year");   
        var diagnosis = data;
        var length;
        var networthArray = new Array();
        
        for(var i=0; i<diagnosis.netWorthAnalysis.yearlyData.length; i++){
            length = diagnosis.netWorthAnalysis.yearlyData[i].length;
            networthArray.push([diagnosis.netWorthAnalysis.yearlyData[i][length-1]]);
            
        }
        
        var yearlysum=0;
        debtsArray=new Array();
        for(var i=0; i<(data.debtAnalysis.yearlyData.length); i++){
            tempArray = data.debtAnalysis.yearlyData[i].monthlyDebts[(data.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
            yearlysum=0;
            for(var j=0; j<tempArray.length; j++){
                yearlysum+=tempArray[j].item.currentValue;
            }
            debtsArray.push(yearlysum);
        }
        for(var i=0; i<(data.yearlySavings.length); i++){
            savingsArray.push(data.yearlySavings[i]);
        }
        
        var objSavingArr=savingsArray;
        var objDebtArr=debtsArray;
        var objNetworthArr=networthArray;
        var objMainArr=data.netWorthAnalysis;
        
        currentNetWorthYear--;
        if(currentNetWorthYear>=offset){
            
            component.set("v.totalSavings",(Math.floor(parseFloat(objSavingArr[currentNetWorthYear-offset]))).toLocaleString());
            component.set("v.totalDebts",(Math.floor(parseFloat(objDebtArr[currentNetWorthYear-offset]))).toLocaleString());
            component.set("v.networth",(Math.floor(parseFloat(objNetworthArr[currentNetWorthYear-offset]))).toLocaleString());           
            component.set("v.year", currentNetWorthYear);
            var beginningProfileNetWorth = data.netWorthAnalysis.yearlyData[0][length-1];
            length = diagnosis.netWorthAnalysis.yearlyData[currentNetWorthYear-offset].length;
            var profileNetWorth = diagnosis.netWorthAnalysis.yearlyData[currentNetWorthYear-offset][length-1];
            var NetworthMessageJS ="Your net worth for the year "+currentNetWorthYear+" is " + Math.ceil((networthArray[currentNetWorthYear-offset]));
            //console.log("NWM" + NetworthMessageJS);
            component.set("v.NetworthMessage", NetworthMessageJS);
        } else {
            //alert("Sorry can not display previous year data");
            var event = $A.get("e.force:showToast");
            event.setParams({ "type" : "Error", "title" : "Info !", "message" : "Sorry can not display year data." });
            event.fire();
        } 
         
    },
    
    nextNetworth : function(component) {
        var debtsArray=new Array();
        var savingsArray=new Array();
        var tempArray = new Array();
        var data = component.get("v.data");
        var offset = data.offset;
        var currentNetWorthYear = component.get("v.year"); 
        var diagnosis = data;
        var length;
        var networthArray = new Array();
        
        for(var i=0; i<diagnosis.netWorthAnalysis.yearlyData.length; i++){
            length = diagnosis.netWorthAnalysis.yearlyData[i].length;
            networthArray.push([diagnosis.netWorthAnalysis.yearlyData[i][length-1]]);
            
        }
        
        var yearlysum=0;
        debtsArray=new Array();
        
        for(var i=0; i<(data.debtAnalysis.yearlyData.length); i++) {
            tempArray = data.debtAnalysis.yearlyData[i].monthlyDebts[(data.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
            yearlysum=0;
            for(var j=0; j<tempArray.length; j++){
                yearlysum+=tempArray[j].item.currentValue;
            }
            debtsArray.push(yearlysum);
        }
        for(var i=0; i<(data.yearlySavings.length); i++){
            savingsArray.push(data.yearlySavings[i]);
        }
        
        var objSavingArr=savingsArray;
        var objDebtArr=debtsArray;
        var objNetworthArr=networthArray;
        var objMainArr=data.netWorthAnalysis;
        
        currentNetWorthYear++;
        if(currentNetWorthYear<=(offset+9)){
            component.set("v.totalSavings",(Math.floor(parseFloat(objSavingArr[currentNetWorthYear-offset]))).toLocaleString());
            component.set("v.totalDebts",(Math.floor(parseFloat(objDebtArr[currentNetWorthYear-offset]))).toLocaleString());
            component.set("v.networth",(Math.floor(parseFloat(objNetworthArr[currentNetWorthYear-offset]))).toLocaleString());
            component.set("v.year", currentNetWorthYear);  
            var beginningProfileNetWorth = data.netWorthAnalysis.yearlyData[0][length-1];
            length = diagnosis.netWorthAnalysis.yearlyData[currentNetWorthYear-offset].length;
            var profileNetWorth = data.netWorthAnalysis.yearlyData[currentNetWorthYear-offset][length-1];
            var NetworthMessageJS ="Your net worth for the year "+currentNetWorthYear+" is " + Math.ceil((networthArray[currentNetWorthYear-offset]));
            //console.log("NWM" + NetworthMessageJS);
            component.set("v.NetworthMessage", NetworthMessageJS);
        } else {
            //alert("Sorry can not display next year data");
            var event = $A.get("e.force:showToast");
            event.setParams({ "type" : "Error", "title" : "Info !", "message" : "Sorry can not display year data." });
            event.fire();
        }
        
    },
})