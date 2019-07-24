body{
    font-family: "Open Sans";
    margin:0;
    padding:0;  
}
.tabsConainer{
    height: auto;
    margin: 0 auto 7%;
    position: relative;
    width: 960px;   
}
.tabs{
    
}
.tabmenu {
    bottom: -70px;
    display: table;
    margin: 0 auto;
    padding: 0;
    position: absolute;
    width: 100%; 
    table-layout: fixed;    
}    
.tabmenu li {
    display: table-cell;
    list-style: none outside none;
    padding: 0 0.5em 0 0;
    position: relative;
    vertical-align: bottom;
}
.tabmenu  > li:last-child {
    padding-right: 0px;
}
.tabmenu li a {
    background: none repeat scroll 0 0 #4E75A3;
    color: #FFFFFF;
    display: block;
    font-size: 14px;
    font-weight: normal;
    font-family: "Open Sans";
    line-height: 2;
    padding: 0.5em 1em;
    text-align: center;
    text-decoration: none;
}
.tabmenu li a:hover {
    color: #FFFFFF;
	text-decoration: none;
}
.tabmenu li a.selected {
    background: none repeat scroll 0 0 #3E5889;
    color: #FFFFFF;
    position: relative;
	text-decoration: none;
}
.tabmenu li a.selected span.arrow {
    border-bottom: 9px solid #3E5889;
    border-left: 9px solid rgba(0, 0, 0, 0);
    border-right: 9px solid rgba(0, 0, 0, 0);
    display: block;
    height: 0;
    top: -9px;
    left: 0;
    width: 0;
    position: absolute;
    right: 0;
    margin: 0 auto;
}   
.tabE {
    clear: both;
    margin: 0 auto;
    padding: 2% 8%;
    position: relative;
    background: #F0F0F0;
    height: auto;
    overflow: hidden;
}
a.mover {
    background-color: #DDDDDD;
    color: #5F5F5F;
    font-size: 11px;
    padding: 2px 12px;
    position: absolute;
    height: 78px;
    width: 30px;
    top: 42%;
}
.next-tab {
    background-image: url("FS_Pr_Nxt");
    background-position: -67px 2px;
    background-repeat: no-repeat;
    bottom: 0;
    right: 0;
}
.prev-tab {
    background-image: url("FS_Pr_Nxt");
    background-position: 8px -5px;
    background-repeat: no-repeat;
    bottom: 0;
    left: 0;
}    
/*new tab css added by amit*/

.fsWrapper{
    width: 99.85%;
    height: auto;
    float: left;
    border: 1px solid #4E75A3;
}
.fsHeader{
    background: #4e75a3;
    float: left;
    width: 100%;
}
.fsHeader h1{
    font-size: 16px;
    font-weight: 600;
    font-family: "Open Sans";
    color: #fff;
    text-transform: uppercase;
    text-align: left;
    float: left;
    padding: 14px 19px;
}
.mt-dashboard-container{
     width:968px; 
     margin:4% auto 0;   
}
.mt-dashboard-top-header{
    width:860px;
    height:75px;
    border:1px #a7a7a7 solid;
    border-radius: 10px 10px 10px 10px;
    background-color:#fff;
    margin-top:35px;
    margin-left:52px;
    margin-bottom:20px;
}

.financial-summary-heading{
    font:bold 22px/26px Arial; 
    color:#777777; 
    float:left; 
    padding-top:17px; 
    padding-left:15px;
}
.financial-graphs-container{
    width:860px;
    height:926px;
    margin:0 auto;
}
/*****your financial box start***********/
.yourFinancialHealth{
    width:auto;
    height:auto;
    float:left;
    border:solid 1px #c7c7c7;
    background-color:#fff;
    overflow: hidden;
}
.mt-dashboardTopHeadingHeader{
    float:left; width:100%;
}
.mt-dashboard-heading2 {
    color: #1f3e73;
    font-size: 18px;
    font-weight: 600;
    font-family: "Open Sans";
    padding-left: 15px;
    padding-top: 15px;
    width:300px;
    float:left;
}
.mt-dahsboardWhatIsThis {
    font: 11px/20px Arial;
    color: #999999;
    padding-top: 16px;
    text-decoration: none;
    width: 42px;
    float:right;
}
.mt-dahsboardWhatIsThis a {
    color: #999999;
    font: 11px/20px Arial;
    text-decoration: underline;
}
.mt-dahsboardWhatIsThis a:hover {
    color: #000000;
    font: 11px/20px Arial;
    text-decoration: none;
}


.mt-your-financialContainer{
    width:100%; 
    float:left; 
}
.mt-your-financial-healthGraph{
    width:100%; height:auto; 
}
.greenTopBorder{
  border-bottom:solid 3px #54ac32; 
  width:250px; 
  height:2px; 
  margin:0 auto;
  margin-bottom:30px; 
}
.mt-greenBottomBorder{
  border-bottom:solid 2px #1f3e73; 
  width:100%; 
  float:left;
}
.mt-GreyHline ul{
    list-style:none;
    list-style-position:outside;
}
.mt-GreyHline li{
    list-style-type:none;
    background:url(Finacast_Chart_Images/sfdc-images/grey_line.png") repeat-x;
    float:left; 
    margin-left:-21px;
    width:320px;
    height:13.1px;
}
.mt-year-heading {
 margin-left:-28px;
 width:100%;
}
.mt-year-heading > ul {
    margin: 0;
    padding: 0;
}
.mt-year-heading ul li{
  list-style-type:none;
  width:auto; 
  float:left;
  font:normal 11px/9px Arial;
  color:#aaaaaa;
  text-align:left;
  padding-top: 5px;
}
.mt-year-heading ul li, ol li{
    margin-right: 3.93em;
    margin-left: 0;
    padding-left: 0;
}
.mt-year-heading-dark{
  font:normal 11px/4px Arial;
  color:#1f3e73;
  text-align:left;
}
.mt-score-heading{ 
  margin-right:15px;
  padding-top: 5px;
  float:right;
  font:bold 11px/11px Arial;
  color:#aaaaaa;
  text-align:right;
}
.greyText{
  font:normal 10px/16px Arial;
  color:#aaaaaa;
  text-align:left;
  text-indent:-24px;
}
.greenText{
  font:normal 10px/16px Arial;
  color:#54ac32;
  text-align:left;
  text-indent:-24px;
}
.month ul{
    list-style:none;
}
.month li{
    list-style:none;
    float:left;
    width:18px;
    background:#aaa9a9;
    font:normal 10px/14px Arial;
    color:#fff;
    text-align:left;
    margin-left:15px;
    margin-top:-13px;
    
}
.shortage{
    width:18px; 
    height:78px; 
    position:absolute; 
    left:264px; 
    top:13px; 
    border-left:solid 1px #54ac32;
    border-right:solid 1px #54ac32;
    background:#fff;
}

.mt-color-slider-bar{
    width:48px; 
    height:170px; 
    position:relative; 
    margin-bottom: 10px;
    margin-right: 12px;
    float: right; 
    background:url("Finacast_Chart_Images/sfdc-images/color-bar.png") no-repeat;
}
.mt-white-slider{
    width:42px; 
    height:26px; 
    margin:0 auto;
    background:url("Finacast_Chart_Images/sfdc-images/white-scroller.png") no-repeat;
    
}
.mt-white-slider-text{
    color:#009900;
    font:bold 18px/26px Arial;
    text-align:center;
    padding-top:3px;
    padding-left:3px;
    text-shadow: 1px 0px 0 #000;
}
.mt-year-ending{
    width:100%; 
    height:102px; 
    float:left; 
    background:url("Finacast_Chart_Images/sfdc-images/mt-greyBg.png") 0 15px repeat-x;
}
.mt-dashboardOrange-mounthsCount{
    width:100%; 
    height:82px; 
    float:left; 
    margin-top:12px;
    position: relative; 
    /*background:url({!URLFOR($Resource.Finacast_Chart_Images, 'sfdc-images/orange-top-bg.png')}) no-repeat;*/
    background: #f7f7f7;
    border-top: solid 1px #f0f0f0;
    
}
.mt-dashboardOrange-mounthsCount span.arrow {
    border-color: #fff rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
    border-style: solid;
    border-width: 10px 11px 10px;
    display: block;
    height: 0;
    left: 20px;
    position: absolute;
    top: 0;
    width: 0;
}
.mt-dashboardMonthsContainer{
    width:90%;  
    float:left;
}
.mt-dashboardMonthsWhiteTextBox{
    background: none;
    width:88px; 
    height:32px; 
    float:left;
    color:#999;
    border: solid 1px #fff; 
}
.mt-dashboardMonthsWhiteText{
    width:96%; 
    height:26px; 
    float:left;
    margin-left:15px;
    margin-top:12px;
    font-size: 12px;
    line-height: 18px;
    font-family: "Open Sans";
    color:#333;
    text-align:left;
}
.mt-dashboardMonthsWhiteTextBox2[type="text"]{
   width:80px; 
   height:26px; 
   margin:3px; 
   font:bold 16px/18px Arial; 
   color:#fff; 
   padding-left:3px;
   border:none;
   background:none;
}

/************circles************/
.mt-dashboard-year-endings{
     float:left;
     width: auto;
     margin-left:10px;
     margin-top:47px;
}
.mt-HouseholdExpenses{
    float:left;
    width:auto; 
    margin-right:18px;
}
.mt-dark-red{
    background:url("Finacast_Chart_Images/sfdc-images/dark_red01.png") no-repeat; 
    width:27px; 
    height:26px; 
    float:left;
}
.mt-light-red{
    background:url("Finacast_Chart_Images/sfdc-images/light_red01.png") no-repeat; 
    width:27px; 
    height:26px; 
    float:left;
}
.mt-light-orange{
    background:url("Finacast_Chart_Images/sfdc-images/light_orange01.png") no-repeat; 
    width:27px; 
    height:26px; 
    float:left;
}
.mt-dark-green{
    background:url("Finacast_Chart_Images/sfdc-images/dark_green01.png") no-repeat; 
    width:27px; 
    height:26px; 
    float:left;
}
.mt-light-green{
    background:url("Finacast_Chart_Images/sfdc-images/light_green01.png") no-repeat; 
    width:27px; 
    height:26px; 
    float:left;
}
.mt-dark-orange{
    background:url("Finacast_Chart_Images/sfdc-images/dark_orange01.png") no-repeat; 
    width:27px; 

    height:26px; 
    float:left;
}

.mt-below-headings{
    width:auto;  
    float:left;
    margin-left:2px;
    margin-top:9px;
    font:normal 11px/14px Arial;
    color:#7A7A7A;
    text-align:left;
}
.mt-year-ending-button{
    background: none repeat scroll 0 0 #1F3E73; 
    width:86px; 
    height:30px; 
    float:left;
}
.mt-year-ending-button-text{
    font:bold 14px/31px Arial; 
    color:#fff; 
    padding-left:10px; 
    text-align:center;
}
/*********************************/


/************end********************/

.yourNetWorth{
    width:420px;
    height:452px;
    float:left;
    margin-left:15px;
    border:1px #54AC32 solid;
    background-color:#fff;
}


.budgetAnalysis{
    width:100%;
    height:auto;
    float:left;
    margin-top:0px!important;
    border:1px #C7C7C7 solid;
    background-color:#fff;
    overflow: hidden;
}

.debtAnalysis{
    width:100%;
    height:auto;
    float:left;
    margin-left:15px;
    margin-top:0px!important;
    border:1px #C7C7C7 solid;
    background-color:#fff; 
    overflow: hidden;
}

.mt-dashboard-footer{
    width:860px;
    height:70px;
    margin-top:20px;
    margin-left:52px;
    margin-bottom:20px;
}
.mt-dashboardBack-button{
    width:117px; 
    height:51px; 
    float:left; 
}
.mt-dashboardNext-button{
    width:117px; 
    height:51px; 
    float:right; 
}
.mt-dashboardBack-button-text{
    font-size: 17px;
    font-weight: normal;
    font-family: "Open Sans";
    line-height: 22px;
    color:#fff;
    text-align:center;
    text-decoration:none;
    text-transform:none;
    background:#54ac32;
    width:117px;
    height:51px;
    border:none;
    cursor:pointer;
}
.mt-dashboardBack-button-text:hover{
    color:#fff;
    text-align:center;
    text-decoration:none;
    background:#4DA52B;
    border:none;
    cursor:pointer;
    transition: 0.5s ease-in-out;
}
/*******your net worth box2************/
.mt-dashboardTopHeadingHeaderNetWorth{
    float:left; 
    width:100%;
}
.mt-your-NetWorthContainer{
    width:100%; 
    float:left; 
    margin-top:10px;
}
.mt-your-NetWorthGraph{
    width:100%; height:auto; 
}
.mt-NetWorthGreyHline ul{
    list-style:none;
    list-style-position:outside;
}
.mt-NetWorthGreyHline li{
    list-style-type:none;
    background:url("Finacast_Chart_Images/sfdc-images/grey_line.png") repeat-x;
    float:left; 
    margin-left:-21px;
    width:320px;
    height:13.1px;
}
.mt-NetWorth-rightSide-Revenu {
    width:75px; 
    height:170px; 
    position:relative; 
    margin-left:330px;  
}
.p{
    font:normal 11px/16px Arial;
    color:#aaaaaa;
    text-align:right;
    text-decoration:none;
}
.mt-NetWorthGreenBottomBorder{
  border-bottom:solid 2px #1f3e73; 
  width:100%; 
  float:left;
}
.mt-NetWorthYear-heading {
 margin-left:-28px;
 width:100%;
}


.mt-NetWorthYear-heading-dark{
  font:normal 11px/4px Arial;
  color:#1f3e73;
  text-align:left;
}
.mt-NetWorthScore-heading{
  width:50px; 
  margin-right:20px;
  float:right;
  font:bold 11px/4px Arial;
  color:#aaaaaa;
  text-align:right;
}
.mt-Net_worthYear-ending{
    width:100%; 
    height:102px; 
    float:left; 
    background:url("Finacast_Chart_Images/sfdc-images/mt-greyBg.png") 0 15px repeat-x;
}
.mt-dashboard-NetWorthYear-endings{
    float:left;
     width:98%;
     height:75px; 
     margin-left:10px;
     margin-top:47px;
}
.mt-dashboardGreen-mounthsCountNetWorth{
    width:420px; 
    height:82px; 
    float:left; 
    margin-top:12px; 
    /*background:url({!URLFOR($Resource.Finacast_Chart_Images, 'sfdc-images/green-top-bg.png')}) no-repeat;*/
    position: relative;
    background: #54ac32;
}
.mt-dashboardGreen-mounthsCountNetWorth span.arrow {
    border-color: #fff rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
    border-style: solid;
    border-width: 10px 11px 10px;
    display: block;
    height: 0;
    left: 20px;
    position: absolute;
    top: 0;
    width: 0;

}
.mt-dashboardNetWorthMonthsContainer{
    height:27px;
    width: 100%; 
    float:left;
}
.mt-dashboardNetWorthMonthsWhiteTextBox{
    border:solid 1px #4e75a3;
    background-color:#fff;
    width:185px; 
    height:29px; 
    float:left;
}
.mt-dashboardNetWorthMonthsWhiteTextBox2-grey[type="text"]{
   width:169px; 
   height:26px; 
   font:normal 14px/18px Arial; 
   color:#1F3E73; 
   padding-left:8px;
   border:none;
   background:none;
   outline: none;
}
.mt-dashboardNetWorthMonthsWhiteTextBox2[type="text"]{
   width:auto; 
   height:26px; 
   font:normal 14px/18px Arial; 
   color:#1F3E73; 
   padding-left:8px;
   border:none;
   background:none;
   outline: none;
}
.mt-dashboardNetWorthMonthsWhiteText{
    width:auto; 
    height:26px; 
    float:left;
    font:normal 12px/14px Arial;
    color:#999;
    text-align:left;
}
.mt-NetWorthAmount-headings{
    color: #1f3e73;
    text-align: left;
    text-decoration: none;
    display: block;
    height: 26px;
    font-size: 12px;
    font-family: "open sans";
    font-weight: 600;
}
.mt-NetWorthbelow-headings{
    width:auto; 
    height:26px; 
    font:normal 11px/14px Arial;
    color:#aaaaaa;
    text-align:left;
    display: block;
}
/*****end************/

/*******budget analysis box3************/
.mt-dahsboardWhatIsThis a:hover {
    color: #000000;
    font: 11px/20px Arial;
    text-decoration: none;
}
.mt-NetWorthGreyHline ul{
    list-style:none;
    list-style-position:outside;
}

.mt-NetWorth-rightSide-Revenu {
    width:75px; 
    height:170px; 
    position:relative; 
    margin-left:330px;  
}
.p{
    font:normal 11px/16px Arial;
    color:#aaaaaa;
    text-align:right;
    text-decoration:none;
}
.mt-NetWorthYear-heading-dark{
  font:normal 11px/4px Arial;
  color:#1f3e73;
  text-align:left;
}
.mt-NetWorthScore-heading{
  width:50px; 
  margin-right:20px;
  float:right;
  font:bold 11px/4px Arial;
  color:#aaaaaa;
  text-align:right;
}
.mt-dashboardRed-mounthsCountBudgetAnalysis{
    width:420px; 
    height:82px; 
    float:left; 
    margin-top:17px; 
    background:#ff0000;
    position: relative;
}
.mt-dashboardRed-mounthsCountBudgetAnalysis span.arrow {
    border-color: #fff rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
    border-style: solid;
    border-width: 10px 11px 10px;
    display: block;
    height: 0;
    left: 20px;
    position: absolute;
    top: 0;
    width: 0;
}
.mt-budgetAnalysisbelow-headings{
    width:auto; 
    height:26px; 
    float:left;
    margin-left:2px;
    margin-top:5px;
    font:normal 11px/14px Arial;
    color:#aaaaaa;
    text-align:left;
}
.mt-budgetAnalysisSubHeading{
    float:left; 
    width:300px; 
    margin-left:17px; 
    font:normal 11px/14px arial; 
    color:#777777;
}
.mt-SubHeadingCircles-blue{
    color:#1f3e73;
    font:bold 15px/14px "Comic Sans MS", cursive; 
}
.mt-SubHeadingCircles-green{
    color:#54ac32;
    font:bold 15px/14px "Comic Sans MS", cursive;
    padding-left:5px; 
}
.mt-SubHeadingCircles-red{
    color:#fe0000;
    font:bold 15px/14px "Comic Sans MS", cursive;
    padding-left:5px; 

}
.BudgetAnalysisBar ul{
    list-style:none;
}
.BudgetAnalysisBar li{
    list-style:none;
    float:left;
    width:18px;
    background:#ff0000;
    font:normal 10px/14px Arial;
    color:#fff;
    text-align:left;
    margin-left:15px;
    margin-top:-13px;   
}
/*****end************/

/*******Debt analysis box4************/
.mt-NetWorthGreyHline ul{
    list-style:none;
    list-style-position:outside;
}

.mt-NetWorth-rightSide-Revenu {
    width:75px; 
    height:170px; 
    position:relative; 
    margin-left:330px;  
}
.p{
    font:normal 11px/16px Arial;
    color:#aaaaaa;
    text-align:right;
    text-decoration:none;
}
.mt-NetWorthYear-heading ul li{
  list-style-type:none;
  width:auto; 
  float:left;
  font:normal 11px/14px Arial;
  color:#aaaaaa;
  text-align:left;
}
.mt-NetWorthYear-heading ul li, ol li{
   margin-right: 1.4em;
   margin-left: 0;
}
.mt-NetWorthYear-heading-dark{
  font:normal 11px/4px Arial;
  color:#1f3e73;
  text-align:left;
}
.mt-NetWorthScore-heading{
  width:50px; 
  margin-right:20px;
  float:right;
  font:bold 11px/4px Arial;
  color:#aaaaaa;
  text-align:right;
}
.mt-dashboard-debtAnalysisYear-endings{
    float:left;
     width:99%;
     height:75px; 
     margin-left:10px;
     margin-top:47px;
}
.mt-dashboardWhite-mounthsCountDebtAnalysis{
    width:100%; 
    height:82px; 
    float:left; 
    margin-top:12px; 
    background:#f7f7f7;
    position: relative;
    border-top: solid 1px #ccc;
}
.mt-dashboardWhite-mounthsCountDebtAnalysis span.arrow {
    border-color: #fff rgba(0, 0, 0, 0) rgba(0, 0, 0, 0);
    border-style: solid;
    border-width: 10px 11px 10px;
    display: block;
    height: 0;
    left: 20px;
    position: absolute;
    top: 0;
    width: 0;
}
.mt-dashboardBudgetAnalysisMonthsWhiteText{
    width:auto; 
    height:26px; 
    float:left;
    font:normal 12px/14px Arial;
    color:#1f3e73;
    text-align:left;
}
.mt-BudgetAnalysisAmount-headings{
    width:auto; 
    height:26px; 
    float:left;
    margin-top:5px;
    font:normal 11px/14px Arial;
    color:#54ac32;
    text-align:left;
}
.mt-DebtAnalysisbelow-headings{
    width:auto; 
    height:26px; 
    float:left;
    margin-left:2px;
    margin-top:5px;
    font:normal 11px/14px Arial;
    color:#aaaaaa;
    text-align:left;
}
.mt-DebtAnalysisSubHeading{
    float:left; 
    width:360px; 
    margin-left:17px; 
    font:normal 11px/14px arial; 
    color:#777777;
}
.mt-SubHeadingCircles-skyblue{
    color:#60cbe6;
    font:bold 15px/14px "Comic Sans MS", cursive; 
    margin-left:40px;
}
.mt-SubHeadingCircles-golden{
    color:#be9c34;
    font:bold 15px/14px "Comic Sans MS", cursive;
    padding-left:5px; 
}
.mt-debtAnalysis-dropDown{
    width:68px;
    height:18px;
    float:left;
    margin-top:-6px;
}

.mt-dashboard-debtAnalysis-small-heading{
    float:left;
     width:412px;
     height:15px; 
     margin-left:10px;
     margin-top:16px;
}
.smallTextBlue{
    color: #1f3e73;
    text-align: left;
    text-decoration: none;
    display: block;
    height: 26px;
    font-size: 12px;
    font-family: "open sans";
    font-weight: 600;
}

.debtAnalysisBar ul{
    list-style:none;
}
.debtAnalysisBar li{
    list-style:none;
    float:left;
    width:18px;
    background:#c2a342;
    font:normal 10px/14px Arial;
    color:#fff;
    text-align:left;
    margin-left:15px;
    margin-top:-13px;   
}
/*****end************/

.tafiGoalList1 {
    display:block;
    margin-left:9px;
    width:400px;
    clear:both;
    padding:20px 0px 0px 0px;
}
.underList ul {
    list-style: circle outside none !important;
}
.underList li {
    list-style: circle outside none !important;
    padding-left:17px;
}
.tafiGoalList2 {
    display:block;
    margin-left:9px;
    width:93%;
}
.tafiGoalList1 li{
    background: url("Finacast_Chart_Images/sfdc-images/green-tick.png") no-repeat 1px 1px;
    color:#64796C;
    display: block;
    font-size: 12px;
    font-weight: bold;
    margin-bottom: 8px;
    float: left;
    display: block;
    width: 100%;
    line-height:20px;
    padding:2px 0px 0px 25px;
}
.tafiGoalList2 li{
    background: url("Finacast_Chart_Images/sfdc-images/cross.png") no-repeat 0 -2px;
    color:#FF2222;
    display: block;
    font-size: 12px;
    font-weight: bold;
    padding-left: 25px;
    margin-bottom: 10px;
    float: left;
    display: block;
    width: 100%;
}

.tafiContentDiv {
    margin: 0 auto;
    padding: 14px;
    width: 900px;
}
div.tafiDiagnosisLeftColumn {
    float: left;
    margin-left: 1px;
    margin-right: 7px;
    width: 437px;
}
div.tafiDiagnosisRightColumn {
    float: left;
    margin-left: 7px;
    margin-right: 1px;
    width: 437px;
}
/*graph tooltip*/
.toolTipCont {
    background-color: #FFFFFF;
    font-family: "Open Sans";
    font-size: 10px;
    margin-left: -15px;
    margin-right: 1px;
    margin-top: -7px;
}
.toolTipLeft {
    background: url("Finacast_Chart_Images/sfdc-images/left.png") no-repeat scroll 0 0 rgba(0, 0, 0, 0);
    float: left;
    height: 54px;
    width: 30px;
}
.toolTipRight {
    background: url("Finacast_Chart_Images/sfdc-images/right.png") no-repeat scroll 0 0 rgba(0, 0, 0, 0);
    float: left;
    height: 54px;
    width: 15px;
}
.toolTipCenter {
    background: none repeat scroll 0 0 #FFFFFF;
    float: left;
    height: 33px;
    margin-left: -5px;
    margin-right: -1px;
}
.toolTipTop {
    background: url("Finacast_Chart_Images/sfdc-images/top.png") repeat scroll 0 0 rgba(0, 0, 0, 0);
    height: 13px;
}
.toolTipBtm {
    background: url("Finacast_Chart_Images/sfdc-images/btm.png") repeat scroll 0 0 rgba(0, 0, 0, 0);
    height: 13px;
    margin-top: 11px;
}
.bubbleValues {
    background-color: #FFFFFF;
    font-family: "Open Sans";
    font-size: 10.3px;
    font-weight: 600;       
}
/***pop-up css start here*/
/***************PopUp******************/
#fade {
    display: none;
    background: #7f7f7f; 
    position: fixed; 
    left: 0; 
    top: 0; 
    width: 100%; 
    height: 100%;
    opacity: .80;
    z-index: 10;
}

.popup_block{
    display: none;
    background:#fff;
    padding: 0px;   
    font-size: 1.2em;
    position: absolute;
    left: 50%;
    top: 40%;
    z-index: 99999;
    width:900px;
    height:auto;
    border:solid 1px #e4dede;
}
img.btn_close {
    position:absolute;
    right:-3px; 
    margin: 6px 10px 0 0;
    border:none;
}
.popup p {
    padding: 5px 10px;
    margin: 5px 0;
}
/*--Making IE6 Understand Fixed Positioning--*/
*html #fade {
    position: absolute;
}
*html .popup_block {
    position: absolute;
}
.mt-right-side-box {
    float: left;
    height: auto;
    padding: 20px;
    padding-top: 0;
    width: auto;
}
.popupHeaderTitle{
    font-size: 16px;
    font-weight: normal;
    font-family: "Open Sans";
    color: #fff;
    background: #4e75a3;
    text-decoration: none;
    padding: 10px 19px;
}
.popupText{
    font-size: 14px;
    font-weight: normal;
    font-family: "Open Sans";
    color: #999;
    overflow-y:auto;
    height:auto;
}
.popupTableText, table{
    border: solid 1px #999!important;
}
.popupTableText, table, td{
    font-size: 14px;
    font-weight: normal;
    font-family: "Open Sans";
    color: #999;
    border-top: solid 1px #999;
    border-left: solid 1px #999;
    border-collapse: collapse;
    padding: 4px 7px;
}

