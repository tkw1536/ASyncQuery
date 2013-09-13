function DemoTest(){
	var ASync_Reset = function(){
		ASyncQuery.Debug("reset");
	};
	var ASync = function(){/* [Nice try. It's not that easy. ] DEBUG_MODE_ENABLED */ return ASyncQuery.apply(42, arguments);};
 	/* From time-to-time update the random names. */
 	var Names_To_Test = [
 		'For your explantion: This test tests several ASyncQuerys by creating them with different names. The test then checks if the creation worked. ',
 		'',
 		/* Static randomly generated names */
 		'x\'qZWh^l%VS1WJ:)FxFHVy^mBoL.H','oqXwT^sR°e?/x','5Utk)E7P/.9X','tL)°KoeQ/$4xG7uyNdKi§!J',
 		'oGL9FPKtoD*xl*a_dpRKqh?=h°4le+','§XiV)C3,4=tZGp$+&§U^_NK','sb_V°EBf:Lk4-o1M8,Qsc','TT29k4xX9&!uw&FFa\'\'',
 		'bI;fW&P&(Ov$W;rKn8aTF0?5E','TM5h/t+Gc°ST5aOc7L)mzz',':I%eFAb7lrA;bJuQs0A=',
 		'Ws/8CdR1vynkCz0UBo7x5Acrrc',':sudi','1d+NJ(INwQ&§a)sJQ4;vNOeG73P2A','pVn§;hH18CRA3e%','KP=iXCdXJc','?QD°',
 		'EybN*uS7%Lrc6lQczlAsx','%CxP_DF.T°nOs^zgi8N,S(eoHXWWd','3',';QQ+_&W;pe1rAkFeagIPflTp).',
 		'nA7TotbMTsKCGkBE_CfQVh,g;U9P','b','Wu;!m\'!V5o°KAgR6c8*x','bfDO$l2','u$/Po564Ld5JV&7e°QuGQ$TXx',
 		'S=+UK)XAyFqWLG5auPSx6FZQcF','_Exes?OAbfec','P7dE4kt^$7;6?ZgDbgHFOUH-0x','t-hdV\'ry^K_i9k7rhzeTT*pZ1eQgGL',
 		'c','8blp3Ac','crhPRPG','9u$g*g7\',-','am9s?VAs5C?GMG.','(%G7','0tK&*buu!DKr_PnN°BDQNb)f8uNZR',
 		'($u/S-!sTM+(-fodrk1l\'y§c.+g','N9bu','tWq','r','P!^\'M=xi!9pU,§Kg_Q/P8$:;',
 		'=(ObET7?JaTP;eqd6?X.Qu+!r','_L§^)VgOZ7R,58U*pISaH9Z','MNm?zSk3S?q(Dt?sHk','.zy2?pBzvf!','eKhX4Jq$',
 		'Tk26nfth','8UTOt(6Pn7BJ!XCUI?b.yI=nm!k:B','EsCHe7xcFK=RFt','T°dpO!rNu3)^xUD',':8Om','ruLlU^f§axcK+a:w_!9C',
 		'_-h7fhO+0MV4J1D?aG','&Z!M1oz_pv8wnwo','0ToV!!\'-xJAqLyIAUyrJkf','--1aFbw!wssP+,','tXILTg7',
 		'fi^KPUF$\'SKo2E5&NReRWAc!ALJ','?u68lq','r8eA=+vLw6',';qZ','(JrG°=Gs:e)a$1hNX',
 		'\'M^.zMKeCiTu3GiVPcH9AEk3mH:Lhe','Za*','6^$u§KB/b&bX*$vE3g)4,cFubM','iI^q;8kACgKHU_q11-','0HPiB',
 		'AHThQ.\'?:vcx0$*$)q8hlM','B%I1%gfn6)86ZBxL.ki%TIQCZOO','do$S4;LT;§n/gt',')°XOr.§w',
 		'ZL$iS,_§TC.10G4R=C\',b^_R2w','\':,VJ/ofEo','=1D','RT0O3&_pgTdBy.6&','T.**Tc=8k;F8X2i°lt\'',
 		'0slg§0Z9.JveRXTr2+\'','SIDO8u0h%kPbz3.','?/n!&?','y8*°UI388n);hK4dzmk-cTcnUv\'_',
 		',y;P2E','T%67F/§)0=LZ!wv7n9','qm=7\'JC\'LN-Pp8ED!HTr',';m*V','H=2AcMgpkc','*$6m-L1w6d^LdBRiF:4kit°0FkCP',
 		'-&\'C$?/Wf','x_Qxg3li+',':','pkf6\'a%NWX4vv^o:\'sF%c+1','S,!Wv*vFy6be:Bbeh95','§P3zZ)1T\'1*Xp','B',
 		'vStI.cF/FLq6NQ+!^HIv,vp1R0PPx°','6PM..D','N4N5/§nkPQ=!kT_Sk5q3*:P$p($','WqAtXk\'\'qoo$CXlas','?Uwr',
 		'8cTQV;ov!;6LGy2**p6+S'];
 	
 	var ASync_Debug = function(obj){
		switch(obj){
			case "reset":
				var list = ASyncQuery_Global_Data("QueryList");
				for(var i=0;i<list.length;i++){
					list[i].stop().clear();
				}
				ASyncQuery_Global_DataStore = {QueryList: [],};
				return null;
			case "Data": 
				return ASyncQuery_Global_Data;
				break;
			case "DataApply": 
				return ASyncQuery_Global_DataApply;
				break;
			default:
				return ASyncQuery_Global_DataStore;
				break;
		}
	};
	//Basic Tests
	module("Base Tests");
	test("Definition Test", function() {
	 	expect(4);
	 	
		equal(typeof ASyncQuery, "function", "An ASyncQuery function is defined. ");
	 	equal(ASyncQuery.toString(), ASync.toString(), "ASyncQuery function is defined properly. ");
		equal(typeof ASyncQuery.Debug, "function", "An ASyncQuery.Debug function is defined. ");
		equal(ASyncQuery.Debug.toString(), ASync_Debug.toString(), "ASyncQuery.Debug is defined properly. ");
	});
	test("Debug() Test", function(){
		expect(3);
		deepEqual( ASyncQuery.Debug(), {QueryList: []}, "ASyncQuery.Debug() overload #0 returns ASyncQuery Debug data. ");
		equal(typeof ASyncQuery.Debug("Data"), "function", "ASyncQuery.data() is available via ASyncQuery.Debug()");
		equal(typeof ASyncQuery.Debug("DataApply"), "function", "ASyncQuery.dataApply() is available via ASyncQuery.Debug()");
	});
	
	
	module("ASyncQuery() Main Function Tests");//Main Function
	test("Naming Tests", function(){
		expect(Names_To_Test.length*3);
		
		var qobjs = [];
		for(var i=0;i<Names_To_Test.length;i++){
			var name = Names_To_Test[i];
			var q = ASyncQuery(name);
			qobjs.push(q);
			equal(q.option("name"), name, "Query #"+(i+1).toString()+" created with correct Name. ")
			deepEqual(ASyncQuery.Debug("Data")("QueryList")[i], q, "Query #"+(i+1).toString()+" inserted in index. ");
			deepEqual(ASyncQuery(name), q, "Query #"+(i+1).toString()+" found by using ASyncQuery(QueryName)");
		}
		ASync_Reset();
	});
	//delayed execution test
	asyncTest("1 minute delayed execution test", function(){
		var Until = 60;
		var Buffer = 2000;
		expect(Until+1);
		var Start = (new Date()).getTime();
		var Times = [];
		for(var i=0;i<=Until;i++){
			Times.push("");
		}
		for(var i=0;i<=Until;i++){
			var jj = parseInt(i.toString());//It's a clone
			var j=jj*1000;
			ASyncQuery(function(jj, j){Times[jj]="Timeout="+j.toString()+" (Actual="+((new Date()).getTime()-Start).toString()+")";}, j, [jj, j]);
		}
		window.setTimeout(function(){
			for(var i=0;i<Times.length;i++){
				var Time = Times[i]
				if(Time!= ""){
					ok(true, Time);
				} else {
					ok(false, "Timeout="+(i*1000).toString()+" (Actual=Never)");
				}
			}
			start();
		}, Until*1000+Buffer);
	});
}


window.onload = function(){
	DemoTest();
}
