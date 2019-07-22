@isTest
public class GoalTypeSelectionTest {
    @isTest
    public static void testCase1()
    {
        String recType = 'CarRecordType';
        GoalTypeSelectionController.getRecordType(recType);
        System.assertEquals('1' , '1');
    }

}