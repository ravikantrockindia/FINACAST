/********* Developer Name: Aditya Kaushal
* updated Date: July 5' 19
* provided new implementation *********/

public class Finacast_ScenarioParentApex {
	
    //reuse the code of FFS Controller but seperate class/ / *Seperation of concerns *
    @auraEnabled
    public static Finacast_FS_ParentApex.WrapperResponse getData(String cid){
        System.debug('client id in parent Scenario: '+ cid);
        return Finacast_FS_ParentApex.getData(cid);
    }
}