(function() {
	var Subtitler = function (argument) {
		this.divId = 'subtitler';
		this.cssShow = 'subtitler-show';
		this.cssHide = 'subtitler-hide';
		this.currentLine = -1;
		if (argument) {
			this.setSubtitle(argument);
		};
	};

	Subtitler.prototype.setSubtitle = function(text) {
		this.subtitleArray = [];
		var rawArray = text.split(/[\r\n]/);
		for (var i = 0, linenum = 1; i < rawArray.length; i++, linenum++) {
			var data = {text: ''};
			if ( rawArray[i] == linenum ) {
				var duration = rawArray[++i];
				data.starttime = toSeconds(duration.split(' --> ')[0]);
				data.endtime = toSeconds(duration.split(' --> ')[1]);
			};
			while( rawArray[++i] != '' ) {
				data.text += rawArray[i];
			}
			this.subtitleArray.push(data);
		};

	};

	Subtitler.prototype.move = function(time) {
		// usually the text is close to current text
		for (var i = 0; i <= 5; i++) {
			var index = this.currentLine + i;
			if ( this.currentLine == -1 ) continue;
			if ( index > this.subtitleArray.length - 1 ) { break; };
			if ( between( time, this.subtitleArray[index].starttime, this.subtitleArray[index].endtime ) ) {
				if(i==0) return; //nothing changed
				this.currentLine += i;
				setHtml(this, this.subtitleArray[index].text);
				this.rest = false;
				return;
			};
		};

		for (var i = -1; i >= -5; i--) {
			var index = this.currentLine + i;
			if ( index < 0 ) { break; };
			if ( between( time, this.subtitleArray[index].starttime, this.subtitleArray[index].endtime ) ) {
				this.currentLine += i;
				setHtml(this, this.subtitleArray[index].text);
				this.rest = false;
				return;
			};
		};

		// if cannot find, do binary search
		var text = binary_search( this, this.subtitleArray, 0, this.subtitleArray.length - 1, time );
		if( text ) {
			setHtml(this, text);
			this.rest = false;
			return;
		}

		// if not found
		if ( this.rest == false ) {
			setHtml(this, undefined);
			this.rest = true;
		};
		

	};

	var binary_search = function( self, array, startindex, endindex, time ) {
		if ( startindex > endindex ) { return undefined };
		if ( startindex + 1 == endindex ) {
			if( between( time, array[startindex].starttime, array[startindex].endtime ) ) {
				self.currentLine = startindex;
				return array[startindex].text;
			}
			if( between( time, array[endindex].starttime, array[endindex].endtime ) ) { 
				self.currentLine = endindex;
				return array[endindex].text;
			}
			return undefined;
		}
		var middle = parseInt( (startindex + endindex) / 2 );
		var result = compareTime( time, array[middle].starttime, array[middle].endtime );
		if ( startindex == endindex && result != 0 ) { return undefined; };
		if ( result == 0 ) {
			self.currentLine = middle;
			return array[middle].text;
		} else if ( result == -1 ) {
			return binary_search( self, array, startindex, middle, time )
		} else if ( result == 1 ) {
			return binary_search( self, array, middle, endindex, time )
		} else {
			return undefined;
		};
	};

	var compareTime = function( time, start, end ) {
		if ( time >= start && time < end ) {
			return 0;
		} else if ( time < start ) {
			return -1;
		} else {
			return 1;
		}
	};

	var between = function( time, start, end ) {
		if ( time >= start && time < end ) {
			return true;
		} else {
			return false;
		}
	};

	var setHtml = function (self, text) {
		console.log(text);
		var subdiv = document.getElementById(self.divId);
		if ( text ) {
			subdiv.innerHTML = text;
			subdiv.className = self.cssShow;
		} else {
			subdiv.innerHTML = '';
			subdiv.className = self.cssHide;
		};
	};



	var toSeconds = function(time) {
		var h2s = time.split(',')[0];
		var mill = time.split(',')[1];
		var h = h2s.split(':')[0];
		var m = h2s.split(':')[1];
		var s = h2s.split(':')[2];
		return parseInt(h) * 3600 + parseInt(m) * 60 + parseInt(s) + parseFloat("0."+mill);
	};

	window.Subtitler = Subtitler;

})();