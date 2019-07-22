({
    myAction : function(component, event, helper) {
        
    },
    
    generateChart: function (component, event, helper) {  
        var chart = new CanvasJS.Chart("chartContainer", {
            animationEnabled: true,  
            title:{
                text: "Predicted Values"
            },
            axisY: {
                title: "Frequeny",
                valueFormatString: "#0,,.",
                suffix: "mn",
                stripLines: [{
                    value: 3366500,
                    label: "Average"
                }]
            },
            data: [{
                yValueFormatString: "#,### Units",
                xValueFormatString: "YYYY",
                type: "spline",
                dataPoints: [
                    {x: new Date(2002, 0), y: 2506000},
                    {x: new Date(2003, 0), y: 2798000},
                    {x: new Date(2004, 0), y: 3386000},
                    {x: new Date(2005, 0), y: 6944000},
                    {x: new Date(2006, 0), y: 6026000},
                    {x: new Date(2007, 0), y: 2394000},
                    {x: new Date(2008, 0), y: 1872000},
                    
                ]
                    }]
            });
                   chart.render();
                   
                   }
 })