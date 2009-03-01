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

var Notifier = {
	// creates the growl html structure, attaches events and displays the alert for 3 seconds
	alert : function(title, message, category) {
    this._createBox('alert', title, message, category);
	  this._appearBox(3);
	},
	// positions the box, animate appears the box and then hides it after specified seconds
	_appearBox : function(showForSeconds) {
		this._positionBox();
		$('notifier_box').animateSwap('transparent', 'opaque', { duration : '1000' });
		this._fadeBox.bind(this).delay(showForSeconds + 1);
	},
	// animate fades the box and then removes the box after the fade is complete
	_fadeBox : function() {
		if (!Notifier.isVisible()) { return; }
		$('notifier_box').animateSwap('opaque', 'transparent', { duration : '1000' });
		Notifier._removeBox.delay(1.2);
	},
	// inserts the html for the box onto the document and attaches the events
	_createBox : function(type, title, message, category) {
		 if (Notifier.isCreated()) { return; }
		 var getBoxHtml = (type == 'alert') ? this._getAlertHtml : this._getConfirmHtml;
		 $(document.body).insert(getBoxHtml(title, message, category));
		 Notifier._attachEvents();
	},
	// removes the html for the box from the document and detaches events
	_removeBox : function() {
		if (Notifier.isDestroyed()) { return; }
		Notifier._detachEvents(); 
		$('notifier_box').remove(); 
	},
	// connects the events for repositioning and closing the box
	_attachEvents : function() {
		if (Notifier.isDestroyed()) { return; }
		Event.observe(window, 'resize', this._positionBox);
	  $$('.notifier .box_hide').each(function(el) { el.observe('click', this._fadeBox); }.bind(this));
	},
	// disconnects the events for the box
	_detachEvents : function() {
		Event.stopObserving(window, 'resize', Notifier._positionBox);
		$$('.notifier .box_hide').each(function(el) { el.stopObserving('click', Notifier._fadeBox); }.bind(Notifier));
	},
	// returns the html necessary to generate an alert box onto the page
	_getAlertHtml : function(title, message, category) {
		var notifyBox = new Element('div', { id : 'notifier_box', className : 'notifier transparent' });
		var notifyContent = new Element('div', { className : 'notifier_content' }); notifyBox.insert(notifyContent);
	  notifyContent.insert(new Element('a', { className : 'box_hide', href : 'javascript:void(0);'}));
		notifyContent.insert(new Element('img', { className : 'box_icon', src : Notifier._getBoxIcon(category), height : 32, width: 32 }));
		notifyContent.insert(new Element('div', { className : 'box_title' }).update(title));
		notifyContent.insert(new Element('div', { className : 'box_message' }).update(message));
		return notifyBox;
	},
	// returns the box icon to be displayed based on the category
	_getBoxIcon : function(category) {
		imageValue = (category == null || category == 'info') ? 'info.png' : 'error.png';
		return imageRoot + imageValue;
	},
	// positions the box in the center of the viewport
	_positionBox : function() {
		$('notifier_box').setStyle(Notifier._getCenterPosition());
	},
	// returns the positions for the center of the viewport
	_getCenterPosition : function() {
		var calculatedHeight = Math.round(document.viewport.getScrollOffsets().top + ((document.viewport.getHeight() - $('notifier_box').getHeight()))/2)+'px';
		var calculatedWidth =  Math.round(document.viewport.getScrollOffsets().left + ((document.viewport.getWidth() - $('notifier_box').getWidth()))/2)+'px';
		return { top: calculatedHeight, left: calculatedWidth };
	},
	// returns true if the notify box currently exists
	isCreated : function() {
		return $('notifier_box') != null;
	},
	// returns true if the notify box does not exist
	isDestroyed : function() {
		return $('notifier_box') == null;
	},
	// returns true if the notify box can be seen on the page
	isVisible : function() {
		return Notifier.isCreated() && $('notifier_box').hasClassName('opaque');
	}
};

// document.fire('notifier:alert', { title : "title", message : "message", category : "error" });
document.observe('notifier:alert', function(e) {
	Notifier.alert(e.memo.title, e.memo.message, e.memo.category);
});