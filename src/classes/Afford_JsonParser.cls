public class Afford_JsonParser{
    
    
    public class root{
        public Boolean debtFlag{get;set;}
        public list<String> downPayment{get;set;}
        public list<String> yearlyListRec{get;set;}
        public list<String> affordResult{get;set;}
        public list<String> downPaymentRec{get;set;}
        public list<String> installmentRec{get;set;}
        public String debtCreatedName{get;set;}
        public list<String> networthAnalysisRecommendList{get;set;}
        public simulationData simulationData{get;set;}
        public list<String> networthAnalysisList{get;set;}
        public list<String> monthlyExpenseList{get;set;}
        public String buynowMsg{get;set;}
        public list<String> monthlyTermDebtRecommendList{get;set;}
        public String topMessage{get;set;}
        public list<String> monthlyGoalTargetList{get;set;}
        public list<String> monthName{get;set;}
        public list<String> cashAvailableForPurchaseRecommendList{get;set;}
        public String resultMessage{get;set;}
        public Integer months{get;set;}
        public String affordResultDate{get;set;}
        public list<String> monthlyIncomeRecommendList{get;set;}
        public list<String> displayMonthList{get;set;}
        public Boolean savingFlag{get;set;}
        public list<String> yearlyList{get;set;}
        public list<String> displayFutureAffordRainyDayFunds{get;set;}
        public String jsonData{get;set;}
        public list<String> displayMonthRecommendList{get;set;}
        public Boolean success{get;set;}
        public Integer currentYear{get;set;}
        public list<String> installment{get;set;}
        public Integer endYear{get;set;}
        public list<String> monthlySavingRecommendList{get;set;}
        public list<String> cashAvailableForPurchaseList{get;set;}
        public String topMessage2{get;set;}
        public Boolean futureFlag{get;set;}
        public Integer endMonth{get;set;}
        public list<String> monthlyCreditCardRecommendList{get;set;}
        public String notAbleToPayMsg{get;set;}
        public Integer currentMonth{get;set;}
        public list<String> monthlyCreditCardList{get;set;}
        public list<String> monthlyIncomeList{get;set;}
        public list<String> monthlyGoalTargetRecommendList{get;set;}
        public list<String> monthlyTermDebtList{get;set;}
        public list<String> savingRecommendations{get;set;}
        public list<String> displayAffordRainyDayFunds{get;set;}
        public list<String> monthlySavingList{get;set;}
        public list<String> monthlyExpenseRecommendList{get;set;}
        
    }
    
    
    public class yearlyData{
        public Decimal interestOnDebt{get;set;}
        public Decimal interestOnTermDebt{get;set;}
        public Integer offset{get;set;}
        public Integer expenses{get;set;}
        public list<String> monthlyGoals{get;set;}
        public list<String> yearlyGoals{get;set;}
        public list<String> monthlyDebts{get;set;}
        public Integer extraContri{get;set;}
        
    }
    
    public class termDebt{
        public Integer termDebtBudget{get;set;}
        public Integer termDebtActual{get;set;}
        
    }
    
    public class simulationData{
        public avatarData avatarData{get;set;}
        //public profileData profileData{get;set;}
        public String avatarName{get;set;}
    }
    
    public class profileData{
        public debtAnalysis debtAnalysis{get;set;}
        public list<financialHealthAnalysis> financialHealthAnalysis{get;set;}
        public list<String> yearlySavings{get;set;}
        public Integer years{get;set;}
        public goalAnalysis goalAnalysis{get;set;}
        public list<String> monthlySavingsTrack{get;set;}
        public netWorthAnalysis netWorthAnalysis{get;set;}
        public Integer offset{get;set;}
        public Integer monthOffset{get;set;}
        public list<String> debugObj{get;set;}
    }
    
    public class nonTermDebt{
        public Decimal nonTermDebtActual{get;set;}
        public Decimal nonTermDebtBudget{get;set;}
        
    }
    
    public class netWorthAnalysis{
        public list<String> yearlyData{get;set;}
        public Integer beginningNetWorth{get;set;}
        
    }
    
    
    public class mustHaveExp{
        public Integer mustHaveExpBudget{get;set;}                              
        public Integer mustHaveExpActual{get;set;}
        
    }
    
    public class goalAnalysis{
        public list<String> goalsOnTrack{get;set;}                              
        public Integer goalItems{get;set;}
        public Integer extraContri{get;set;}
        public list<String> goalsMet{get;set;}
        public list<String> goalsNotOnTrack{get;set;}
        public list<yearlyData> yearlyData{get;set;}
    }
    
    public class goal{
        public Integer goalActual{get;set;}
        public Integer goalBudget{get;set;}
        
    }
    
    public class financialHealthAnalysis{
        
        public String redMessage{get;set;}
        public Decimal score{get;set;}
        public String greenMessage{get;set;}
        public Integer months{get;set;}
        public nonTermDebt nonTermDebt{get;set;}
        public goal goal{get;set;}
        public termDebt termDebt{get;set;}
        public Integer scoreNumber{get;set;}
        public desiredExp desiredExp{get;set;}
        public mustHaveExp mustHaveExp{get;set;}
        
    }
    
    public class desiredExp{
        public Integer desiredExpActual{get;set;}                             
        public Integer desiredExpBudget{get;set;}
        
    }
    
    public class debtPayed{
        public Integer year{get;set;}
        public Boolean isTermDebt{get;set;}
        public Integer month{get;set;}
        public String name{get;set;}
    }
    
    public class debtAnalysis{
        public list<debtPayed> debtPayed{get;set;}
        public Integer shortTermFlag{get;set;}        
        public Decimal endingDebt{get;set;}
        public Decimal interestOnDebt{get;set;}
        public Integer debtItems{get;set;}
        public list<yearlyData> yearlyData{get;set;}
        public Integer beginningDebt{get;set;}
        public Integer longTermFlag{get;set;}
    }
    
    public class avatarData{
        public list<String> yearlySavings{get;set;}
        public list<String> monthlySavingsTrack{get;set;}
        public Integer years{get;set;}
        public list<financialHealthAnalysis> financialHealthAnalysis{get;set;}
        public goalAnalysis goalAnalysis{get;set;}
        public debtAnalysis debtAnalysis{get;set;}
        public netWorthAnalysis netWorthAnalysis{get;set;}
        public Integer offset{get;set;}
        public Integer monthOffset{get;set;}
        public list<String> debugObj{get;set;}
    }
    public static root parse(String jsonString) {
        return (root) System.JSON.deserialize(jsonString, root.class);
    }
}