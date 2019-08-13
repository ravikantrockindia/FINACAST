({
    emptyCheck: function(component, obj){
        if($A.util.isUndefinedOrNull(obj.yearlyData) || $A.util.isUndefinedOrNull(obj.beginningNetWorth)){
            return true;
        }
        
        if(obj.length == 0){
            return true;
        }
            return false;
    },
    
	 showNetworth : function(component) {
        var dataSeries = new Array();
        var d1 = new Array();
        var d2 = new Array();
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
                //console.log("len",length);
                networthArray.push([diagnosis.netWorthAnalysis.yearlyData[i][length-1]]);
                // d1.push([(offset+i-0.15), diagnosis.netWorthAnalysis.yearlyData[i][length-1]]);
                d1.push(offset+i);
                d2.push(Math.floor(diagnosis.netWorthAnalysis.yearlyData[i][length-1]));
            }
            //console.log("d1",d1);
            //console.log("d2",d2);
            var chartdata = component.get("v.chartDataObject");
            if(chartdata) {
                chartData.destroy();
            }
            chartdata = {
                labels: d1,
                datasets: [
                    {
                        label:'Networth Analysis',
                        data: d2,
                        backgroundColor: 'rgba(0, 0, 255, 0.3)'
                    }
                    
                ]
            }
            
            
            var ctx = component.find("networth").getElement();
            var lineChart = new Chart(ctx ,{
                type: 'bar',
                data: chartdata,
                options: {
                    
                    scales: {                                               
                        yAxes: [{
                            ticks: {
                                suggestedMin: 0,    
                                beginAtZero: true,
                                callback: function(label, index, labels) {
                                    return Intl.NumberFormat('Yo', { 
                                        style: 'currency', currency: 'USD', minimumFractionDigits: 0, 
                                    }).format(label);
                                }
                            }
                        }]
                    },
                    
                    legend: {
                        position: 'bottom',
                        padding: 1,
                        labels: {
                            // This more specific font property overrides the global property
                            fontColor: 'black',
                            FontSize:32,
                            fontFamily:"Helvetica",
                        },                 
                    },
                    responsive: true
                }
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
        var networthArray = new Array();;
        
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
        } else {
            //alert("Sorry can not display next year data");
            var event = $A.get("e.force:showToast");
            event.setParams({ "type" : "Error", "title" : "Info !", "message" : "Sorry can not display year data." });
            event.fire();
        }
    },
})