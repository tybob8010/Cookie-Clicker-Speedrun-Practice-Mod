

Game.registerMod("Speedrun Practice Mod",{ 
	init:function(){ 
		
		Game.SpeedrunMode="";

		Game.AccurateSayTime=function(time,detail)
	    {
		    if (time<=0) return '';
		    var str='';
		    var detail=detail||0;
		    time=Math.floor(time);
		    if (detail==-1)
		    {
			    var days=0;
			    var hours=0;
		        var minutes=0;
			    var seconds=0;
			    var miliseconds=0;
			    if (time>=1000*60*60*24) days=(Math.floor(time/(1000*60*60*24)));
			    if (time>=1000*60*60) hours=(Math.floor(time/(1000*60*60)));
			    if (time>=1000*60) minutes=(Math.floor(time/(1000*60)));
			    if (time>=1000) seconds=(Math.floor(time/(1000)));
			    if (time>=1) miliseconds=(Math.floor(time));
			    hours-=days*24;
			    minutes-=hours*60+days*24*60;
			    seconds-=minutes*60+hours*60*60+days*24*60*60;
			    miliseconds-=minutes*60+hours*60*60+days*24*60*60*1000;
			    var bits=[];
			    if (days>0) bits.push(Beautify(days));
			    if (hours>0) bits.push(Beautify(hours));
			    if (minutes>0) bits.push(Beautify(minutes));
			    if (seconds>0) bits.push(Beautify(seconds));
			    if (miliseconds>0) bits.push(Beautify(miliseconds%1000));
			    if (bits.length==0) str=loc("less than 1 second");
			    else str=bits.join(':');
		    }
		    return str;
	    }

		eval('Game.updateShimmers='+Game.updateShimmers.toString().replace("Math.random()","0"));//all shimmers spawn as early as possible

		eval('Game.dropRateMult='+Game.dropRateMult.toString().replace("rate*=5;","rate*=5; rate*=1e40;"));//all season drops are really common

		eval('Game.UpdateMenu='+Game.UpdateMenu.toString().replace("Running version:","Runing version:"));

		eval('Game.shimmerTypes["golden"].popFunc='+Game.shimmerTypes['golden'].popFunc.toString().replace("var choice=choose(list);","if (Game.SpeedrunMode==`OneMillionCookies`) {var choice=`click frenzy`;} else if (Game.SpeedrunMode==`Neverclick`) {var choice=`frenzy`;} else if (Game.SpeedrunMode==`TrueNeverclick` && Game.goldenClicks<3) {var choice=`multiply cookies`;} else if (Game.SpeedrunMode==`TrueNeverclick` && Game.goldenClicks>2) {var choice=`frenzy`;} else var choice=choose(list);"));

		Game.CheckModes=function(){
			var date=new Date();
		    date.setTime(Date.now()-Game.startDate);
		    var timeInMiliseconds=date.getTime();
		    var startDate=Game.AccurateSayTime(timeInMiliseconds,-1);
			date.setTime(Date.now()-Game.fullDate);
			var fullDate=Game.AccurateSayTime(date.getTime(),-1);
			if (!fullDate || fullDate.length<1) fullDate='a long while';

			if (Game.AchievementsOwned>=40 && Game.SpeedrunMode=="FourteenAchievements" && !Game.ShowFourteenAchievementsNotifs) { Game.Notify(`You reached 40 achievements!`,"In "+fullDate, [5,6],60*3,1); Game.ShowFourteenAchievementsNotifs=1;};

			if (Game.SpeedrunMode=="Neverclick" && Game.cookieClicks>15) { Game.Notify(`You clicked the big cookie more than 15 times`,"",[0,0],60*2,1); Game.HardReset(2);};
		}
		l('commentsText1').style='font-size:15.5px'
		
		Game.registerHook('logic',Game.CheckModes);

		Game.EnableModes=function(){
			if (Game.keys[49]) {Game.SpeedrunMode="OneMillionCookies"; Game.Popup('1 million cookies mode enabled.');};
			if (Game.keys[50]) {Game.SpeedrunMode="Hardcore"; Game.Popup('Hardcore mode enabled.');};
			if (Game.keys[51]) {Game.SpeedrunMode="TrueNeverclick"; Game.Popup('True Neverclick mode enabled.');};
			if (Game.keys[52]) {Game.SpeedrunMode="Neverclick"; Game.Popup('Neverclick mode enabled.');};
			if (Game.keys[53]) {Game.SpeedrunMode="FourteenAchievements"; Game.Popup('40 achievements mode enabled.');};
			if (Game.keys[59]) {Game.SpeedrunMode=""; Game.Popup('mode disabled.');};
			if (Game.keys[72]) {Game.season="halloween"; Game.seasonT=Game.fps*60*60*24*60; Game.Popup('Halloween activated.');};
			if (Game.keys[67]) {Game.season="christmas"; Game.seasonT=Game.fps*60*60*24*60; Game.Popup('Christmas season activated.');};
			if (Game.keys[86]) {Game.season="valentines"; Game.seasonT=Game.fps*60*60*24*60; Game.Popup('Valentine\'s day activated.');};
			if (Game.keys[66]) {Game.season="fools"; Game.seasonT=Game.fps*60*60*24*60; Game.Popup('Business day activated.');};
			if (Game.keys[69]) {Game.season="easter"; Game.seasonT=Game.fps*60*60*24*60; Game.Popup('Easter season activated.');};
			if (Game.keys[82]) {Game.season=""; Game.Popup('Season restarted.');};
			
			/*if (Game.keys[55])
			if (Game.keys[56])
			if (Game.keys[57])*/
		}
		
		Game.registerHook('logic',Game.EnableModes);

		l('httpsSwitch').insertAdjacentHTML('afterend','<div class="title" style="font-size:25px;" "background-color:#ff0000;" id="logo"></div>');


		Game.registerHook('draw', () => {
			l('logo').innerHTML='<b>'+'</b>'+"Speedrun Practice Mod is on";	
	    });

		Game.registerHook('reset',function(hard){
			if (hard)
		    {
                Game.ShowFourteenAchievementsNotifs=0;
			}
		});
	},
    save:function() {
    },
	load:function(str) {
    }
});