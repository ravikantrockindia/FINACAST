//Code Written by Aditya Kaushal in Fall 2018
public class MonteCarloSimulationTest {
    
    public static String goalTargetDate{get; set;}
    public static string goalriskProfile{get; set;}
    public static double goalinitialAmount{get; set;}
    public static double goaltargetAmount{get; set;}
    public static double goalMonthlySaving{get; set;}
    public static double goalavg{get; set;}
    public static integer simulationMonths{get; set;}
    
    public static string riskProfile{get; set;}
    public static integer simulationYear{get; set;}
    public static double initialAmount{get; set;}
    public static double targetAmount{get; set;}
    public static double annualSaving{get; set;}
    public static integer iterations;
    public static double avg{get; set;}
    public static double SD{get; set;}
    public static Double standardDeviation{get; set;}
    public static Double MeanValue{get; set;}
    public static Double result{get; set;}
    public static Map<integer, double> standardDeviationValueMap{get; set;}
    
    public static boolean showSimulationResult{get; set;}
    public static boolean simulationError{get; set;}
    public static String simulationErrorMessage{get; set;}
    public static double confidence68Prcnt{get; set;}
    public static double confidence95Prcnt{get; set;}
    
    @auraEnabled
    public static WrapperResponse Pageinit(String gid)
    {
        //Details of the current Goal 
        List<FinServ__FinancialGoal__c> gitems = [Select Current_Goal_Amount__c,Start_Value__c,FinServ__TargetValue__c,
                                                  FinServ__TargetDate__c, Required_Monthly_Saving__c
                                                  from FinServ__FinancialGoal__c where id =: gid];
        
        //Fetch PickList values from Schema Object
        List<String> pickListValuesList= new List<String>();
        Schema.DescribeFieldResult fieldResult = FinServ__FinancialAccount__c.FinServ__ModelPortfolio__c.getDescribe();
        List<Schema.PicklistEntry> ple = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry pickListVal : ple) {            
            pickListValuesList.add(pickListVal.getLabel());
        } 
        
        WrapperResponse wrapObject = new WrapperResponse();
        try{
            wrapObject.goalInitialValues = gitems;
            wrapObject.pickListValues = pickListvaluesList;
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return wrapObject;
    }
    
    //Actual Simulation Method
    @auraEnabled       
    public static Map<integer, double> sample(Integer goalinitialAmount, Integer goaltargetAmount, Integer goalMonthlySaving, 
                                              String goalTargetDate, String riskProfile, Double volatility ){
                                                  
                                                  List<Double> conf = new List<Double>();
                                                  simulationError = false;
                                                  showSimulationResult = true;
                                                  
                                                  try{    
                                                      iterations = 1000;          
                                                      initialAmount = Double.valueOf(goalinitialAmount);            
                                                      targetAmount = Double.valueOf(goaltargetAmount); 
                                                      
                                                      //The Actual value fetched from the Screen is annual Saving though it saved in GoalMonthlySaving
                                                      //This Step was required alternative would be to call Resimulation. It is Tricky Look the UI and Object Field Values
                                                      annualSaving = Double.valueOf(goalMonthlySaving);
                                                      
                                                      goalMonthlySaving = Integer.valueOf(annualSaving/12);
                                                      
                                                      //annualSaving = goalMonthlySaving*12;
                                                      goalriskProfile = riskProfile;     
                                                      SD = volatility;
                                                      simulationMonths = 0;
                                                      simulationYear = 0;
                                                      
                                                      //Date targetDate = setStringToDateFormat(goalTargetDate);
                                                      Date targetDate = Date.valueOf(goalTargetDate);
                                                      
                                                      if(date.today().monthsBetween(targetDate) < 12) {
                                                          simulationMonths = date.today().monthsBetween(targetDate);
                                                      } else {
                                                          simulationYear = (date.today().monthsBetween(targetDate))/12;
                                                      } 
                                                      
                                                      //Fetch the Percentage from Custom Metadata as is would be required in Post Deploment Step 
                                                      //It allows Orgs to set their own RiskProfile Percentages as for different Countries.
                                                      Model_Portfolio_Setting__mdt portfolio = [SELECT MasterLabel, Model_Portfolio_Percentage__c 
                                                                                                FROM Model_Portfolio_Setting__mdt where MasterLabel =: goalriskProfile];
                                                      
                                                      if(goalriskProfile != null && goalriskProfile != '') {
                                                          avg = Double.valueOf(portfolio.Model_Portfolio_Percentage__c);
                                                      } else {
                                                          avg = 5;
                                                      }
                                                      
                                                      List<double> simulatedVals =new List<double>();
                                                      for(integer j=0; j < iterations; j++) {         
                                                          double finalAmount=0.0;
                                                          double calInitialAmount=initialAmount;
                                                          String str = '';
                                                          if(simulationMonths != 0 && simulationMonths > 0) {             
                                                              for(integer i=0;i<simulationMonths;i++) {   
                                                                  finalAmount=calInitialAmount + Integer.valueOf(goalMonthlySaving);      
                                                                  calInitialAmount=finalAmount;      
                                                              }
                                                          }
                                                          
                                                          else{                
                                                              for(integer i=0;i<simulationYear;i++){
                                                                  double normal = normInv(avg, SD);
                                                                  finalAmount=calInitialAmount+((calInitialAmount*normal)/100)+annualSaving;
                                                                  calInitialAmount=finalAmount;
                                                              }
                                                              if(math.mod(date.today().monthsBetween(targetDate), 12) > 0) {
                                                                  //simulationMonths = math.mod(date.today().monthsBetween(targetDate), 12);
                                                                  for(integer i=0; i < math.mod(date.today().monthsBetween(targetDate), 12); i++){
                                                                      finalAmount=calInitialAmount+goalMonthlySaving;
                                                                      calInitialAmount=finalAmount;
                                                                  }                        
                                                              }
                                                          }
                                                          
                                                          simulatedVals.add(finalAmount);
                                                      }
                                                      standardDeviation = Math.round(standardDeviation(simulatedVals)); 
                                                      simulatedVals.sort();
                                                      standardDeviationValueMap = new Map<integer, double>();
                                                      standardDeviationValueMap.put(13, Math.round(evaluatePercentile(simulatedVals, 99)));
                                                      standardDeviationValueMap.put(12, Math.round(evaluatePercentile(simulatedVals, 95)));
                                                      standardDeviationValueMap.put(11, Math.round(evaluatePercentile(simulatedVals, 68)));
                                                      standardDeviationValueMap.put(1, Math.round(evaluatePercentile(simulatedVals, 32)));
                                                      standardDeviationValueMap.put(2, Math.round(evaluatePercentile(simulatedVals, 5)));
                                                      standardDeviationValueMap.put(3, Math.round(evaluatePercentile(simulatedVals, 1)));
                                                      standardDeviationValueMap.put(0, MeanValue);
                                                      
                                                      confidence68Prcnt = Math.round(evaluatePercentile(simulatedVals, 32));
                                                      confidence95Prcnt = Math.round(evaluatePercentile(simulatedVals, 5));
                                                      
                                                      conf.add(confidence68Prcnt);
                                                      conf.add(confidence95Prcnt);
                                                  }catch(exception ee){
                                                      showSimulationResult = false;
                                                      simulationErrorMessage = ee.getMessage();
                                                      simulationError = true;
                                                      System.debug(ee.getStackTraceString());
                                                  }
                                                  
                                                  return standardDeviationValueMap;
                                              }
    
    /*public List<Double> reSimulation(){
List<Double> conf = new List<Double>();
simulationError = false;
showSimulationResult = true;
try{
iterations= 1;
goalMonthlySaving = annualSaving/12.0;

if(goalriskProfile != null && goalriskProfile != ''){
if(riskProfile == 'Short Term (3.0%)'){
avg = 3;   
}
if(riskProfile == 'Conservative (4.0%)'){
avg = 4;   
}
if(riskProfile == 'Balanced (5.0%)'){
avg = 5;   
}
if(riskProfile == 'Growth (7.0%)'){
avg = 7;   
}            
if(riskProfile == 'Aggressive (9.0%)'){
avg = 9;   
}
if(riskProfile == 'Very Aggressive (11.0%)'){
avg = 11;   
}

}else{
riskProfile = 'Balanced (5.0%)';
avg = 5;
}

List<double> simulatedVals =new List<double>();
for(integer j=0; j < iterations; j++){
double finalAmount=0.0;
double calInitialAmount=initialAmount;
String str = '';

if(simulationMonths != 0 && simulationMonths > 0){
for(integer i=0;i<simulationMonths;i++){
finalAmount=calInitialAmount+goalMonthlySaving;
calInitialAmount=finalAmount;
}
}
if(simulationYear != 0 && simulationYear > 0){
for(integer i=0;i<simulationYear;i++){
double normal = normInv(avg,4);
system.debug(normal);
finalAmount=calInitialAmount+((calInitialAmount*normal)/100)+annualSaving;
calInitialAmount=finalAmount;
}
}
simulatedVals.add(finalAmount);
}

standardDeviation = Math.round(standardDeviation(simulatedVals)); 
simulatedVals.sort();
standardDeviationValueMap = new Map<integer, double>();
standardDeviationValueMap.put(13, Math.round(evaluatePercentile(simulatedVals, 99)));
standardDeviationValueMap.put(12, Math.round(evaluatePercentile(simulatedVals, 95)));
standardDeviationValueMap.put(11, Math.round(evaluatePercentile(simulatedVals, 68)));
standardDeviationValueMap.put(1, Math.round(evaluatePercentile(simulatedVals, 32)));
standardDeviationValueMap.put(2, Math.round(evaluatePercentile(simulatedVals, 5)));
standardDeviationValueMap.put(3, Math.round(evaluatePercentile(simulatedVals, 1)));
standardDeviationValueMap.put(0, MeanValue);

double per68 = 32;
double per95 = 5;
confidence68Prcnt = Math.round(evaluatePercentile(simulatedVals, per68));
confidence95Prcnt = Math.round(evaluatePercentile(simulatedVals, per95));

conf.add(confidence68Prcnt);
conf.add(confidence95Prcnt);
}catch(exception ee){
showSimulationResult = false;
simulationErrorMessage = ee.getMessage();
simulationError = true;
}
return conf; 
} */
    
    public static double normInv(double avg, double SD) {      
        double nG= nextGaussian();  
        system.debug('gaussian ' + nG);
        return (double) (avg + SD * nG);
    }    
    
    private static double nextNextGaussian;
    private static boolean haveNextNextGaussian = false;
    
    //This Method Creates the Random Variable
    public static double nextGaussian() {
        if(haveNextNextGaussian) {
            haveNextNextGaussian = false;
            return nextNextGaussian;
        } else {    
            double x = 0, y = 0, rds;
            do {
                x = Math.random()*2-1;
                y = Math.random()*2-1;
                rds = x*x + y*y;
            }
            while (rds == 0 || rds > 1);
            // Box-Muller Transform
            double multiplier = Math.sqrt(-2*Math.log(rds)/rds);
            nextNextGaussian = y*multiplier;
            haveNextNextGaussian = true;
            return x*multiplier;
        }       
    }
    
    public static Double standardDeviation(List<Double> simulatedVals)
    {
        //determine the sum of the range of numbers
        Double sum = 0;
        for(Double d : simulatedVals)
        {
            sum += d;
        }
        
        //determine the mean of the range of numbers
        Double mean = sum / simulatedVals.size();
        MeanValue = Math.round(mean);
        //for each number subtract the mean and square the result
        Double squaredDifferencesSum = 0;
        for(Double d : simulatedVals)
        {
            squaredDifferencesSum += Math.pow((d-mean), 2);
        }
        
        //determine the mean for the squared differences
        Double squaredDifferencesMean = squaredDifferencesSum / simulatedVals.size();
        
        //determine the standard deviation
        Double standardDeviation = Math.sqrt(squaredDifferencesMean);
        
        return standardDeviation;
    }
    
    private static double evaluatePercentile( List<double> sorted, double p )
    {
        double n = sorted.Size();
        double pos = p * (n + 1) / 100;
        double fpos = Math.floor(pos);
        integer intPos = (integer) fpos;
        double dif = pos - fpos;
        if (pos < 1) {
            return sorted[0];
        }
        if (pos >= n) {
            return sorted[sorted.size() - 1];
        }
        double lower = sorted[intPos - 1];
        double upper = sorted[intPos];
        return lower + dif * (upper - lower);
        
    }  
    
    //wrapper for init method
    public class WrapperResponse {
        @auraEnabled public List<FinServ__FinancialGoal__c> goalInitialValues;
        @auraEnabled public List<String> pickListValues;
    }
}