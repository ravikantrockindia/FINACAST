public class SummaryCashFlowController {
    
    @auraEnabled
    public static Date getMonth(String month){
        System.debug(month);
        List<String> tempList=month.split(',');
        system.debug('rtyuiop');
        Date st=null;
        try{
            String mon = tempList[0].trim();
            Map<String,Integer> monthMap = new Map<String , Integer>{'JAN' => 1 , 'FEB'=> 2, 'MAR'=> 3, 'APR'=> 4, 'MAY'=> 5, 'JUN'=> 6, 'JUL'=> 7, 'AUG'=> 8, 'SEP'=>9, 'OCT'=>10, 'NOV'=> 11, 'DEC'=> 12};
                Integer stMonth = monthMap.get(mon); 
            Integer yea = Integer.valueOf(tempList[1].trim());
            st = date.newInstance(yea,stMonth,1);
        }
        catch(Exception e){
            FinacastUtility.ExceptionHandle(e.getLineNumber(), e.getMessage(), e.getStackTraceString());
        }
        return st;
    }
}