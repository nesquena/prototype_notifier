Prototype Notifier
====================

IMPORTANT
----------

This library came directly out of an application which is currently live. As such, the plugin does
work to an extent. However, it is extremely new and very rough. There is little support or respect
for internet explorer. It works in IE6+ but the alerts do not have rounded corners or other niceties.

I want to encourage anyone who is interested in this library to send me thoughts, suggestions,
or anything because I am looking to improve it greatly. Let me know if something is broken or 
could be better!

PREFACE
---------

This library was created with the intention of being a lightweight, prototype-based, alternative to the
native javascript alert tag. The alert tag is obnoxious, ugly, and modal. There are many times when 
the user should be notified of an event using javascript which could use a better option. 

I looked around and found a few options out there for modal dialogs but none of them seemed right 
for the job. I want nothing more than a pleasant way to let the user know a validation failed, 
or a message was received. The best option I could find for prototype was a growl4rails plugin
found here: [growl4rails repository](http://github.com/jfiorato/growl4rails/tree/master).
I admit that plugin does a great job, but for my limited purposes I felt it was a bit too heavy.
The plugin includes helper methods for integrating the project with rails. I was looking
for a lightweight library that was server-side framework agnostic.

INSTALLATION
-------------

First, copy over and include the necessary javascript, stylesheets and images 
into the appropriate places.

    <link href="stylesheets/notifier.css" type="text/css" rel="stylesheet">
    <script src="javascripts/prototype.js" type="text/javascript" charset="utf-8"></script>
    <script src="javascripts/animator.js" type="text/javascript" charset="utf-8"></script>
    <script src="javascripts/notifier.js" type="text/javascript" charset="utf-8"></script>
    
The only dependencies for the notifier is prototype and animator. I should explain that I personally 
am not a fan of scriptaculous so this library uses the lightweight animator library which allows me 
to easily morph elements between states using simple css classes.

Once the notifier is properly included and the assets are copied over, it is likely the paths
for the images are not properly setup. I have not yet made this totally painless, but you may
want to check the notifier.js and notifier.css to ensure that image paths are correct. The place
specifying images is marked with the comment "CHANGE THIS PATH"

USAGE
------

Using the notifier is as simple as invoking the command below:

    Notifier.alert("Message sent!", "Your message has been sent.", 'info');

Note this should be done once the document has been loaded. The full example would be:

    document.observe('dom:loaded', function() {
    	Notifier.alert("Message sent!", "Your message has been sent.", 'info');
    });
    
There are two types of notifications right now: Informational and Error.
      
    Notifier.alert("Message sent!", "Your message has been sent.", 'info');
    Notifier.alert("Server error!", "The server did not respond.", 'error');
    
Optionally, notifications can be displayed by firing a custom event as well:

    document.fire('notifier:alert', { title : "title", message : "message", category : "error" });
    
That is all there is to this right now. You can add custom images by simply adding 'xxx.png' to the same location as
the other icons and then specify the category as 'xxx'.

AUTHORS
-------

Nathan Esquenazi (3/01/2009)