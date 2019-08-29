({
    
    generateChart: function (component, event, helper) { 


        var offset;

        


                var tabledata = component.get("v.Tabledata");
                tabledata = JSON.parse(tabledata);
                
                var viewingOption=component.get("v.currentselectedValue");
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
                
                var yearlist = new Array();
                var yearlistdata = new Array();
                var networthArray=new Array();
                var debtsArray=new Array();
       			 var savingsArray=new Array();
                 var tempArray = new Array();
                var length;
                for(var i=0; i<objectDisplay.netWorthAnalysis.yearlyData.length; i++){
                    length = objectDisplay.netWorthAnalysis.yearlyData[i].length;
                    yearlist.push(offset+i);
                                   networthArray.push([objectDisplay.netWorthAnalysis.yearlyData[i][length-1]]);
                    yearlistdata.push(Math.floor(objectDisplay.netWorthAnalysis.yearlyData[i][length-1]));
                }
                console.log('yearlist---'+yearlist);
                console.log('yearlist---'+yearlistdata);
            
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
            
            var chart = new CanvasJS.Chart("chartContainer3.4", {
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
            var yearlysum;
            for(var i=0; i<(objectDisplay.debtAnalysis.yearlyData.length); i++) {
                tempArray = objectDisplay.debtAnalysis.yearlyData[i].monthlyDebts[(objectDisplay.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
                yearlysum=0;
                for(var j=0; j<tempArray.length; j++){
                    yearlysum+=tempArray[j].item.currentValue;
                }
                debtsArray.push(yearlysum);
            }
            for(var i=0; i<(objectDisplay.yearlySavings.length); i++){
                savingsArray.push(objectDisplay.yearlySavings[i]);
            }
            
            var objSavingArr=savingsArray;
            var objDebtArr=debtsArray;
            var objNetworthArr=networthArray;
            var objMainArr=objectDisplay.netWorthAnalysis;
            var   currentNetWorthYear = offset;      
           //  currentNetWorthYear++;
         //   if(currentNetWorthYear == offset){
                component.set("v.totalSavings",(Math.floor(parseFloat(objSavingArr[0]))).toLocaleString());
                component.set("v.totalDebts",(Math.floor(parseFloat(objDebtArr[0]))).toLocaleString());
                component.set("v.networth",(Math.floor(parseFloat(objNetworthArr[0]))).toLocaleString());
                component.set("v.year", currentNetWorthYear);           
           // }            
            
            //total networth
            var beginningProfileNetWorth = objectDisplay.netWorthAnalysis.yearlyData[0][length-1];
            length = objectDisplay.netWorthAnalysis.yearlyData[0].length;
            var profileNetWorth = objectDisplay.netWorthAnalysis.yearlyData[currentNetWorthYear-offset][length-1];
            var NetworthMessageJS ="Your net worth for the year "+currentNetWorthYear+" is " + Math.ceil((networthArray[0]));
            component.set("v.NetworthMessage", NetworthMessageJS);
            chart.render();
            

        
    },
    showNextYearlyScore : function(component, event, helper) {
        var debtsArray=new Array();
        var savingsArray=new Array();
        var tempArray = new Array();
       var data = component.get("v.Tabledata");
        data = JSON.parse(data);
        
        var viewingOption=component.get("v.currentselectedValue");
        console.log('viewingOption2'+viewingOption);
        var objectDisplay ='';
        if(viewingOption=='buy'){
            objectDisplay=data.simulationData.avatarData;
        }else if(viewingOption=='nobuy'){
            objectDisplay=data.simulationData.profileData;
        }else if(viewingOption=='recommend'){
            objectDisplay=data.simulationData.recommendData;
        }
        
        var offset = objectDisplay.offset;
        var currentNetWorthYear = component.get("v.year"); 
        var diagnosis = objectDisplay;
        var length;
        var networthArray = new Array();
        
        for(var i=0; i<diagnosis.netWorthAnalysis.yearlyData.length; i++){
            length = diagnosis.netWorthAnalysis.yearlyData[i].length;
            networthArray.push([diagnosis.netWorthAnalysis.yearlyData[i][length-1]]);
            
        }
        
        var yearlysum=0;
        debtsArray=new Array();
        
        for(var i=0; i<(objectDisplay.debtAnalysis.yearlyData.length); i++) {
            tempArray = objectDisplay.debtAnalysis.yearlyData[i].monthlyDebts[(objectDisplay.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
            yearlysum=0;
            for(var j=0; j<tempArray.length; j++){
                yearlysum+=tempArray[j].item.currentValue;
            }
            debtsArray.push(yearlysum);
        }
        for(var i=0; i<(objectDisplay.yearlySavings.length); i++){
            savingsArray.push(objectDisplay.yearlySavings[i]);
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
		    var beginningProfileNetWorth = objectDisplay.netWorthAnalysis.yearlyData[0][length-1];
            length = objectDisplay.netWorthAnalysis.yearlyData[0].length;
            var NetworthMessageJS ="Your net worth for the year "+currentNetWorthYear+" is " + Math.ceil((networthArray[currentNetWorthYear-offset]));
            component.set("v.NetworthMessage", NetworthMessageJS);
            component.set("v.year", currentNetWorthYear);           
        } 
      
    },
    showPrevYearlyScore : function(component) {
                var debtsArray=new Array();
        var savingsArray=new Array();
        var tempArray = new Array();
       var data = component.get("v.Tabledata");
        data = JSON.parse(data);
        
        var viewingOption=component.get("v.currentselectedValue");
        console.log('viewingOption2'+viewingOption);
        var objectDisplay ='';
        if(viewingOption=='buy'){
            objectDisplay=data.simulationData.avatarData;
        }else if(viewingOption=='nobuy'){
            objectDisplay=data.simulationData.profileData;
        }else if(viewingOption=='recommend'){
            objectDisplay=data.simulationData.recommendData;
        }
        
        var offset = objectDisplay.offset;
        var currentNetWorthYear = component.get("v.year"); 
        var diagnosis = objectDisplay;
        var length;
        var networthArray = new Array();
        
        for(var i=0; i<diagnosis.netWorthAnalysis.yearlyData.length; i++){
            length = diagnosis.netWorthAnalysis.yearlyData[i].length;
            networthArray.push([diagnosis.netWorthAnalysis.yearlyData[i][length-1]]);
            
        }
        
        var yearlysum=0;
        debtsArray=new Array();
        
        for(var i=0; i<(objectDisplay.debtAnalysis.yearlyData.length); i++) {
            tempArray = objectDisplay.debtAnalysis.yearlyData[i].monthlyDebts[(objectDisplay.debtAnalysis.yearlyData[i].monthlyDebts.length - 1)];
            yearlysum=0;
            for(var j=0; j<tempArray.length; j++){
                yearlysum+=tempArray[j].item.currentValue;
            }
            debtsArray.push(yearlysum);
        }
        for(var i=0; i<(objectDisplay.yearlySavings.length); i++){
            savingsArray.push(objectDisplay.yearlySavings[i]);
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
		    var beginningProfileNetWorth = objectDisplay.netWorthAnalysis.yearlyData[0][length-1];
            length = objectDisplay.netWorthAnalysis.yearlyData[0].length;
            var NetworthMessageJS ="Your net worth for the year "+currentNetWorthYear+" is " + Math.ceil((networthArray[currentNetWorthYear-offset]));
            component.set("v.NetworthMessage", NetworthMessageJS);
            component.set("v.year", currentNetWorthYear);           
        } 
    }
    
    
})