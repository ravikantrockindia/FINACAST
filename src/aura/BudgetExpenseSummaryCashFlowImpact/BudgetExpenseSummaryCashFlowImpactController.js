({
    doInit : function(component, event, helper) {
        var chartDataArray = [];
        var chartLabelArray = [];
      component.get("v.tansactionId");
       // alert("Transaction Id " +component.get("v.tansactionId"))
        var action = component.get("c.getSummaryTransaction");  
        action.setParams({
            Id: component.get("v.tansactionId")
        })
        
        var temp=[];
        action.setCallback(this, function(response) {
            
            //Last Six Months here
            var dataMap={};
            var today=new Date();
            var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];        
        	for(var i=5;i>-1;i--){
	            var	d=new Date(today.getFullYear(),today.getMonth()-i,1);
                var currMonth=monthNames[d.getMonth()];
                dataMap[currMonth]=0;
            }
            
            var apexResponse = response.getReturnValue();
             
            //extract response against last six months and cummulate them
            for( var i=0; i<apexResponse.length; i++)
            {
                var str = apexResponse[i].FinServ__TransactionDate__c;
                var index = parseInt(str.substring(5, 7));
				temp.push(monthNames[index-1]);
                var sum = dataMap[monthNames[index-1]] + parseInt(apexResponse[i].FinServ__Amount__c);
                dataMap[monthNames[index-1]]=sum;
            }

            //Push Map keys and Values in seperate Arrays
            for(var d in dataMap){
                chartDataArray.push(dataMap[d]);
                chartLabelArray.push(d);
            }
            
            console.log('Data: ' + chartDataArray);
            console.log('Label: ' + chartLabelArray);
            
           var dps =new Array();       
            for(var i=0; i<chartLabelArray.length; i++){
                dps.push({label: chartLabelArray[i] , y: chartDataArray[i],color:"skyblue"});
            }
            console.log('dps: ' + JSON.stringify(dps));            
            var chart = new CanvasJS.Chart("Canvas01", {
                theme: "light1", // "light2", "dark1", "dark2"
                animationEnabled: true, // change to true		
                axisY:{
                    //  valueFormatString:"#0K",
                    gridColor: "#ffffff",
                    tickColor: "#ffffff"
                },
                data: [
                    {
                        // Change type to "bar", "area", "spline", "pie",etc.
                        yValueFormatString: "$ #,### ",
                        type: "column",
                        
                        dataPoints:dps
                    }
                ]
            });
            
            chart.render();
        })
        $A.enqueueAction(action);
    }                      
})