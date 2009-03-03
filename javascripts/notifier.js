/* 

Used to display custom alerts and confirm boxes in a growl like visual style.

Dependencies:
  * Prototype >= 1.6         (http://www.prototypejs.org/)
  * Animator & Extensions    (http://github.com/nesquena/example_animator/tree/master)

Examples:

   Notifier.alert("Title", "Message"); // defaults to info icon
   Notifier.alert("Message sent!", "Your message has been sent.", 'info');
   Notifier.alert("Server error!", "The server did not respond.", 'error');

*/

imageRoot = "images/"; // CHANGE THIS PATH TO THE IMAGES

var AlertNotification = Class.create({
	initialize : function(heading, message, category) {
		this.heading = heading; this.message = message; this.category = category;
	},
	// execute this alert notification
	execute : function(position, heightOffset) {
		this._createBox(position, heightOffset);
	  this._appearBox(3);
	},
	// fires when the box is finished notifying
	onComplete : function(box) {},
	// returns the height of the box
	getHeight : function() { return this.element.getHeight(); },
	// inserts the html for the box onto the document and attaches the events
	_createBox : function(position, heightOffset) {
		 this.position = position;
		 this.heightOffset = heightOffset;
		 $(document.body).insert(this._getHtml(this.heading, this.message, this.category));
		 this.element = $('notifier_box_' + position);
		 this._attachEvents();
		 this._positionBox();
	},
	// positions the box, animate appears the box and then hides it after specified seconds
	_appearBox : function(showForSeconds) {
		this.element.animateSwap('transparent', 'opaque', { duration : '1000' });
		this._fadeBox.bind(this).delay(showForSeconds + 1);
	},
	// animate fades the box and then removes the box after the fade is complete
	_fadeBox : function() {
		this.element.animateSwap('opaque', 'transparent', { duration : '1000' });
		this._removeBox.bind(this).delay(1.2);
	},
	// removes the html for the box from the document and detaches events
	_removeBox : function() {
		this._detachEvents(); 
		this.element.remove(); 
		this.onComplete(this);
	},
	// connects the events for repositioning and closing the box
	_attachEvents : function() {
		this.positionHandler = this._positionBox.bind(this);
		Event.observe(window, 'resize', this.positionHandler);
		this.element.down('.box_hide').observe('click', this._fadeBox.bind(this));
	},
	// disconnects the events for the box
	_detachEvents : function() {
		Event.stopObserving(window, 'resize', this.positionHandler);
		this.element.down('.box_hide').stopObserving('click');
	},
	// returns the html necessary to generate an alert box onto the page
	_getHtml : function(title, message, category) {
		var notifyBox = new Element('div', { id : 'notifier_box_' + this.position, className : 'notifier transparent' });
		var notifyContent = new Element('div', { className : 'notifier_content' }); notifyBox.insert(notifyContent);
	  notifyContent.insert(new Element('a', { className : 'box_hide', href : 'javascript:void(0);'}));
		notifyContent.insert(new Element('img', { className : 'box_icon', src : this._getBoxIcon(category), height : 32, width: 32 }));
		notifyContent.insert(new Element('div', { className : 'box_title' }).update(title));
		notifyContent.insert(new Element('div', { className : 'box_message' }).update(message));
		return notifyBox;
	},
	// returns the box icon to be displayed based on the category
	_getBoxIcon : function(category) {
		return imageRoot + (category || 'info') + '.png';
	},
	// positions the box in the center of the viewport
	_positionBox : function() {
		this.element.setStyle(this._getCenterPosition());
	},
	// returns the positions for the center of the viewport
	_getCenterPosition : function() {
		var calculatedHeight = Math.round(document.viewport.getScrollOffsets().top + ((document.viewport.getHeight() - this.element.getHeight()))/2);
		var calculatedWidth =  Math.round(document.viewport.getScrollOffsets().left + ((document.viewport.getWidth() - this.element.getWidth()))/2);
		calculatedHeight += this.heightOffset;
		return { top: calculatedHeight + 'px', left: calculatedWidth + 'px' };
	}
});

var Notifier = {
	pendingBoxes : [], // queue of pending notifications
	activeBoxes : [], // list of active visible notifications this round,
	completedBoxes : [], // list of completed boxes this round,
	maxToDisplay : 3, // number of notifications to display at once
	// creates the growl html structure, attaches events and displays the alert for 3 seconds
	alert : function(heading, message, category) {
		var newAlert = new AlertNotification(heading, message, category);
		this.pendingBoxes.push(newAlert);
		this._showNextNotification();
	},
	// shows the next pending notification
	_showNextNotification : function() {
		if (this.pendingBoxes.length <= 0 || this._currentRoundIsFull()) { return; }
		var notifyBox = this.pendingBoxes.shift();
		notifyBox.onComplete = this._boxCompleted;
		notifyBox.execute(this.activeBoxes.length, this._getHeightOffset());
		this.activeBoxes.push(notifyBox);
		this._showNextNotification();
	},
	// fires when a box has finished displaying
	_boxCompleted : function(notifyBox) {
		Notifier.activeBoxes.removeItem(notifyBox); Notifier.completedBoxes.push(notifyBox);
		if (Notifier._isRoundComplete()) { Notifier._startNextRound();  } 
	},
	// returns true if additional notifications can appear on screen
	_currentRoundIsFull : function() {
		var totalBoxesInRound = Notifier.activeBoxes.length + Notifier.completedBoxes.length;
		return totalBoxesInRound >= this.maxToDisplay;
	},
	// returns true if the round is completed
	_isRoundComplete : function() {
		return Notifier.activeBoxes.length == 0;
	},
	// clears the boxes from the current round
	_startNextRound : function() {
		Notifier.activeBoxes = [];
		Notifier.completedBoxes = [];
		Notifier._showNextNotification();
	},
	// returns the current display height to aid in positioning messages
	_getHeightOffset : function() {
		return Notifier.activeBoxes.collect(function(e) { return e.getHeight(); }).inject(0, function(sum, value) { return sum + value; });
	}
};

// document.fire('notifier:alert', { title : "title", message : "message", category : "error" });
document.observe('notifier:alert', function(e) {
	Notifier.alert(e.memo.title, e.memo.message, e.memo.category);
});

Array.prototype.removeItem = function(itemToRemove) {
    var j = 0;
    while (j < this.length) {
        if (this[j] == itemToRemove) { this.splice(j, 1); } 
        else { j++; }
    } 
};