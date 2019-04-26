@isTest
public class MonteCarloSimulationTestTestClass {
    
    @isTest static void testSimulatedShortValues() {
        Map<integer, double> returnedMap = 
            MonteCarloSimulationTest.sample(1000, 50000, 500, '2021-01-01 00:00:00', 'Moderate', 4);
        Integer MapSize = returnedMap.size();
        System.assertEquals(7, MapSize);
    }
    
    @isTest static void testSimulatedConsevativeValues() {
        Map<integer, double> returnedMap = 
            MonteCarloSimulationTest.sample(1000, 50000, 500, '2021-01-01 00:00:00', 'Conservative', 4);
        Integer MapSize = returnedMap.size();
        System.assertEquals(7, MapSize);
    }
    
    @isTest static void testSimulatedBalancedValues() {
        Map<integer, double> returnedMap = 
            MonteCarloSimulationTest.sample(1000, 50000, 500, '2021-01-01 00:00:00', 'Balanced', 4);
        Integer MapSize = returnedMap.size();
        System.assertEquals(7, MapSize);
    }
    
    @isTest static void testSimulatedGrowthValues() {
        Map<integer, double> returnedMap = 
            MonteCarloSimulationTest.sample(1000, 50000, 500, '2021-01-01 00:00:00', 'Growth', 4);
        Integer MapSize = returnedMap.size();
        System.assertEquals(7, MapSize);   
    }
    
    @isTest static void testSimulatedAggressiveValues() {
        Map<integer, double> returnedMap = 
            MonteCarloSimulationTest.sample(1000, 50000, 500, '2021-01-01 00:00:00', 'Aggressive', 4);
        Integer MapSize = returnedMap.size();
        System.assertEquals(7, MapSize);
    }
    
    @isTest static void testSimulatedVeryAggresiveValues() {
        Map<integer, double> returnedMap = 
            MonteCarloSimulationTest.sample(1000, 50000, 500, '2021-01-01 00:00:00', 'Very Aggressive', 4);
        Integer MapSize = returnedMap.size();
        System.assertEquals(7, MapSize);
    }
    
   /* @isTest static void testSimulatedElseValues() {
        Map<integer, double> returnedMap = 
            MonteCarloSimulationTest.sample(1000, 50000, 500, '2019-05-01 00:00:00', NULL , 4);
        Integer MapSize = returnedMap.size();
        System.assertEquals(7, MapSize);
    }*/
    
    
    @isTest static void  checkPageinit() {
        Account a = new Account(Name='Test Account');
        String accRecType =Schema.SObjectType.Account.getRecordTypeInfosByName().get('Individual').getRecordTypeId();
        a.RecordTypeId = accRecType;
        insert a;
        FinServ__FinancialGoal__c goal = new FinServ__FinancialGoal__c();
        goal.Name = 'test goal';
        goal.FinServ__PrimaryOwner__c = a.id;
        insert goal;
        FinServ__FinancialGoal__c f = [select id from FinServ__FinancialGoal__c  where name = 'test goal'];
        List<FinServ__FinancialGoal__c> goalDetails = MonteCarloSimulationTest.Pageinit(f.Id).goalInitialValues;
        Integer fSize = goalDetails.size();
        System.assertEquals(1, fSize);
    }
    
}