Game.registerMod("Speedrun Practice Mod",{ 
	init:function(){ 
		
		Game.SpeedrunMode = "";

		Game.AccurateSayTime = function(time, detail) {
		    if (time <= 0) return '';
		    let str = '';
		    detail = detail || 0;
		    time = Math.floor(time);
		    if (detail == -1) {
			    let days = 0;
			    let hours = 0;
		        let minutes = 0;
			    let seconds = 0;
			    let milliseconds = 0;
			    
			    if (time >= 1000 * 60 * 60 * 24) days = Math.floor(time / (1000 * 60 * 60 * 24));
			    if (time >= 1000 * 60 * 60) hours = Math.floor(time / (1000 * 60 * 60));
			    if (time >= 1000 * 60) minutes = Math.floor(time / (1000 * 60));
			    if (time >= 1000) seconds = Math.floor(time / 1000);
			    if (time >= 1) milliseconds = Math.floor(time);

			    hours -= days * 24;
			    minutes -= hours * 60 + days * 24 * 60;
			    seconds -= minutes * 60 + hours * 60 * 60 + days * 24 * 60 * 60;
			    milliseconds -= minutes * 60 + hours * 60 * 60 + days * 24 * 60 * 60 * 1000;

			    let bits = [];
			    if (days > 0) bits.push(Beautify(days));
			    if (hours > 0) bits.push(Beautify(hours));
			    if (minutes > 0) bits.push(Beautify(minutes));
			    if (seconds > 0) bits.push(Beautify(seconds));
			    if (milliseconds > 0) bits.push(Beautify(milliseconds % 1000));
			    
			    str = (bits.length == 0) ? loc("1秒未満") : bits.join(':');
		    }
		    return str;
	    };

		// ゴールデンクッキーが最速で出現
		eval('Game.updateShimmers = ' + Game.updateShimmers.toString().replace("Math.random()", "0"));

		// 季節ドロップが非常に出やすくなる
		eval('Game.dropRateMult = ' + Game.dropRateMult.toString().replace("rate*=5;", "rate*=5; rate*=1e40;"));

		// バージョン表示（スペルミス修正だけ）
		eval('Game.UpdateMenu = ' + Game.UpdateMenu.toString().replace("Running version:", "Runing version:"));

		// ゴールデンクッキーの効果をモード別に制御
		eval('Game.shimmerTypes["golden"].popFunc = ' + Game.shimmerTypes['golden'].popFunc.toString().replace(
			"var choice=choose(list);",
			`if (Game.SpeedrunMode=="OneMillionCookies") {
				let choice="click frenzy";
			} else if (Game.SpeedrunMode=="Neverclick") {
				let choice="frenzy";
			} else if (Game.SpeedrunMode=="TrueNeverclick" && Game.goldenClicks<3) {
				let choice="multiply cookies";
			} else if (Game.SpeedrunMode=="TrueNeverclick" && Game.goldenClicks>2) {
				let choice="frenzy";
			} else let choice = choose(list);`
		));

		// モードのチェックと処理（通知やセーブ初期化）
		Game.CheckModes = function() {
			let date = new Date();
		    date.setTime(Date.now() - Game.startDate);
		    let timeInMilliseconds = date.getTime();
		    let startDate = Game.AccurateSayTime(timeInMilliseconds, -1);

			date.setTime(Date.now() - Game.fullDate);
			let fullDate = Game.AccurateSayTime(date.getTime(), -1);
			if (!fullDate || fullDate.length < 1) fullDate = 'かなり前';

			if (Game.AchievementsOwned >= 40 && Game.SpeedrunMode == "FourteenAchievements" && !Game.ShowFourteenAchievementsNotifs) {
				Game.Notify(`実績40個達成！`, `達成時間: ${fullDate}`, [5,6], 60 * 3, 1);
				Game.ShowFourteenAchievementsNotifs = 1;
			}

			if (Game.SpeedrunMode == "Neverclick" && Game.cookieClicks > 15) {
				Game.Notify(`大クッキーを15回以上クリックしました`, "", [0,0], 60 * 2, 1);
				Game.HardReset(2);
			}
		};
		
		l('commentsText1').style = 'font-size:15.5px';
		
		Game.registerHook('logic', Game.CheckModes);

		// モードをキーボードで切り替え
		Game.EnableModes = function() {
			if (Game.keys[49]) { Game.SpeedrunMode = "OneMillionCookies"; Game.Popup('100万クッキーモード 有効'); }
			if (Game.keys[50]) { Game.SpeedrunMode = "Hardcore"; Game.Popup('ハードコアモード 有効'); }
			if (Game.keys[51]) { Game.SpeedrunMode = "TrueNeverclick"; Game.Popup('真・ネバークリックモード 有効'); }
			if (Game.keys[52]) { Game.SpeedrunMode = "Neverclick"; Game.Popup('ネバークリックモード 有効'); }
			if (Game.keys[53]) { Game.SpeedrunMode = "FourteenAchievements"; Game.Popup('実績40モード 有効'); }
			if (Game.keys[59]) { Game.SpeedrunMode = ""; Game.Popup('モード 無効化'); }

			// 季節イベント
			if (Game.keys[72]) { Game.season = "halloween"; Game.seasonT = Game.fps * 60 * 60 * 24 * 60; Game.Popup('ハロウィン 有効'); }
			if (Game.keys[67]) { Game.season = "christmas"; Game.seasonT = Game.fps * 60 * 60 * 24 * 60; Game.Popup('クリスマス 有効'); }
			if (Game.keys[86]) { Game.season = "valentines"; Game.seasonT = Game.fps * 60 * 60 * 24 * 60; Game.Popup('バレンタイン 有効'); }
			if (Game.keys[66]) { Game.season = "fools"; Game.seasonT = Game.fps * 60 * 60 * 24 * 60; Game.Popup('ビジネスデー 有効'); }
			if (Game.keys[69]) { Game.season = "easter"; Game.seasonT = Game.fps * 60 * 60 * 24 * 60; Game.Popup('イースター 有効'); }
			if (Game.keys[82]) { Game.season = ""; Game.Popup('季節イベントをリセット'); }
		};
		
		Game.registerHook('logic', Game.EnableModes);

		l('httpsSwitch').insertAdjacentHTML('afterend', '<div class="title" style="font-size:25px;" "background-color:#ff0000;" id="logo"></div>');

		Game.registerHook('draw', () => {
			l('logo').innerHTML = '<b></b>' + "Speedrun Practice Mod 作動中";	
	    });

		Game.registerHook('reset', function(hard) {
			if (hard) {
                Game.ShowFourteenAchievementsNotifs = 0;
			}
		});
	},

	save: function() {},

	load: function(str) {}

});
