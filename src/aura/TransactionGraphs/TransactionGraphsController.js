({
    doInit : function(component, event, helper) {
        var chartDataArray = [];
        var chartLabelArray = [];
       	var recId = component.get("v.recordId");
        console.log('record Id: ' + recId);
        var action = component.get("c.getTransaction");  
        action.setParams({
            Id: recId
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
            console.log('ApexResponse for Transaction Graph: '+ apexResponse);
            //extract response against last six months and cummulate them
            for( var i=0; i<apexResponse.length; i++)
            {
                var str = apexResponse[i].FinServ__TransactionDate__c;
                var index = parseInt(str.substring(5, 7));
				temp.push(monthNames[index-1]);
                
                if(apexResponse[i].FinServ__TransactionType__c != null){
                if(apexResponse[i].FinServ__TransactionType__c =='Debit') {
                    var sum = dataMap[monthNames[index-1]] - parseInt(apexResponse[i].FinServ__Amount__c);}
                else{
                    var sum = dataMap[monthNames[index-1]] + parseInt(apexResponse[i].FinServ__Amount__c);}
                }
            else {
                    var sum = dataMap[monthNames[index-1]] + parseInt(apexResponse[i].FinServ__Amount__c);}
                
                dataMap[monthNames[index-1]]=sum;
            }

            //Push Map keys and Values in seperate Arrays
            for(var d in dataMap){
                chartDataArray.push(dataMap[d]);
                chartLabelArray.push(d);
            }
            
            console.log('Data: ' + chartDataArray);
            console.log('Label: ' + chartLabelArray);
            
            
            
            
           /* var chartdata = component.get("v.chartDataObject");
            if(chartdata) {
                chartData.destroy();
            }
            */
            
            var chartdata = {
                labels: chartLabelArray,
                datasets: [
                    {
                        label:'Transactions',
                        data: chartDataArray,
                        backgroundColor:'rgba(0, 0, 255, 0.3)'
                    }
                ]
            }
            
            var ctx = component.find("transactionGraph").getElement();
            var lineChart = new Chart(ctx ,{
                type: 'bar',
                data: chartdata,
                options: {	
                    
                    //format y axis
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
                    },
                    responsive: true
                   
                }
            });
        })
        $A.enqueueAction(action);
    }                      
})