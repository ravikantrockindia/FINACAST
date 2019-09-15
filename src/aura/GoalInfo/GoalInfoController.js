({	
    doInit: function(component, event, helper){
        
        component.set("v.showModalGoal",false);
        $A.get('e.force:refreshView').fire();
        helper.generateChart(component, event, helper);
        
    },
    onClickEditGoals : function(component,event,helper) {
        var clnt = component.get("v.cid")
        var getName = component.get("v.editrecidGoal");
        
        component.set("v.showModalGoal",true);
        var action = component.get("c.getRecordTypeIdbyName");
        //  component.set("v.editrecidGoal",event.getSource().get("v.value"));
        action.setParams({     
            objectName  : "FinServ__FinancialGoal__c",
            strRecordTypeName : getName,
            
        });
        
        action.setCallback(this, function(response) {
            
            
            
            var recordTypeName = response.getReturnValue();
            console.log("record type",recordTypeName);
            //
            var heading,subheading ;
            var icon;
            
            var isRetirement , isNonRetirement = true;
            if(recordTypeName == "WeddingRecordType")
            {
                heading = "Wedding";
                subheading = "Finacast will help you plan your Wedding";
                var icon = $A.get("$Resource.WeddingIcon");
                component.set("v.icon",icon);
                component.set("v.isNonRetirement",true); 
                component.set("v.isRetirement",false);
            }
            else if (recordTypeName == "CarRecordType")
            {
                heading = "Car";
                subheading = "Finacast will help you plan your Car purchase";
                var icon = $A.get("$Resource.CarIcon");
                component.set("v.icon",icon);
                component.set("v.isNonRetirement",true); 
                component.set("v.isRetirement",false);
            }
                else if (recordTypeName == "VacationRecordType")
                {
                    heading = "Vacation";
                    subheading = "Finacast will help you plan your vacation";
                    var icon = $A.get("$Resource.VacationIcon");
                    component.set("v.icon",icon);
                    component.set("v.isNonRetirement",true); 
                    component.set("v.isRetirement",false);
                    
                }
                    else if (recordTypeName == "EducationRecordType")
                    {
                        heading = "Education";
                        subheading = "Finacast will help you plan your Education";
                        var icon = $A.get("$Resource.EducationIcon");
                        component.set("v.icon",icon);
                        component.set("v.isNonRetirement",true); 
                        component.set("v.isRetirement",false);
                    }
                        else if (recordTypeName == "HomeRecordType")
                        {
                            heading = "Home";
                            subheading = "Finacast will help you plan your home";
                            var icon = $A.get("$Resource.HomeIcon");
                            component.set("v.icon",icon);
                            component.set("v.isNonRetirement",true); 
                            component.set("v.isRetirement",false);
                        }
                            else if (recordTypeName == "HomeImprovementRecordType")
                            {
                                heading = "Home Improvement";
                                subheading = "Finacast will help you plan your  Home Improvement";
                                var icon = $A.get("$Resource.HomeImprovementIcon");
                                component.set("v.icon",icon);
                                component.set("v.isNonRetirement",true); 
                                component.set("v.isRetirement",false);
                            }
                                else if (recordTypeName == "OtherGoalsRecordType")
                                {
                                    heading = "Other Goals";
                                    subheading = "Finacast will help you plan your Goals";
                                    var icon = $A.get("$Resource.OtherGoalsIcon");
                                    component.set("v.icon",icon);
                                    component.set("v.isNonRetirement",true); 
                                    component.set("v.isRetirement",false);
                                }
                                    else if (recordTypeName == "RetirementRecordType")
                                    {
                                        component.set("v.isRetirement",true);
                                        component.set("v.isNonRetirement",false);
                                    }
            
            //
            /* if(recordTypeName == "RetirementRecordType")
            {
                component.set("v.isRetirement",true);
                component.set("v.isNonRetirement",false);
            }
            else
            {
               component.set("v.isNonRetirement",true); 
               component.set("v.isRetirement",false);

            }  */
            component.set("v.heading",heading);
            
            //  component.set("v.editrecidGoal",event.getSource().get("v.value"));            
        });             
        $A.enqueueAction(action); 
        
    },
    generateChart: function (component, event, helper) { 
        
        
            var financialscore=component.get("v.res");
            var containername= component.get("v.editrecidGoal");
            var gauge = {
                
                data : { y: financialscore }, //gauge value change it
                maximum : 100
            };
            
            var chart = new CanvasJS.Chart(containername);
            createGauge(chart);
            
            //Function for gauge
            function createGauge(chart){
                //Caluculation of remaining parameters to render gauge with the help of doughnut
                gauge.unoccupied = {
                    y: gauge.maximum - gauge.data.y , 
                    color: "#DEDEDE", 
                    toolTipContent: null, 
                    highlightEnabled: false,
                    click : function (){ gauge.unoccupied.exploded = true; }
                }
                gauge.data.click = function (){ gauge.data.exploded = true; };
                
                if (financialscore>=30 && financialscore<60)
                    if(!gauge.data.color)
                        gauge.data.color = "#ff8400";
                
                if (financialscore<30 )
                    if(!gauge.data.color)
                        gauge.data.color = "#8B0000";
                
                if (financialscore>=60 )
                    if(!gauge.data.color)
                        gauge.data.color = "#538f56";
                var data = {
                    type: "doughnut",
                    innerRadius: 100,
                    dataPoints: [
                        {
                            y: gauge.maximum ,
                            color: "transparent",
                            toolTipContent: null
                        },
                        gauge.data,
                        gauge.unoccupied
                    ],
                };
                
                if(!chart.options.data)
                    chart.options.data = [];
                chart.options.data.push(data);
                
                if(gauge.title){
                    chart.options.title = gauge.title;
                }
                
                //For showing value
                if(!chart.options.subtitles)
                    chart.options.subtitles = [];
                chart.options.subtitles.push(gauge.valueText);
                
                chart.render();
                
            }
        
        
        //end set callback
        
    }
 })