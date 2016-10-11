window.twttr = (function(d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0],
        t = window.twttr || {};
    if (d.getElementById(id)) return;
    js = d.createElement(s);
    js.id = id;
    js.src = "https://platform.twitter.com/widgets.js";
    fjs.parentNode.insertBefore(js, fjs);

    t._e = [];
    t.ready = function(f) {
        t._e.push(f);
    };

    return t;
}(document, "script", "twitter-wjs"));



var utilities = function() {
    var Cookies = {
        createCookie: function (name, value, days) {
            var expires;

            if (days) {
                var date = new Date();
                date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
                expires = "; expires=" + date.toGMTString();
            } else {
                expires = "";
            }
            document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
        },

        readCookie: function(name) {
            var nameEQ = encodeURIComponent(name) + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) === ' ') c = c.substring(1, c.length);
                if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
            }
            return null;
        },

        eraseCookie: function (name) {
            this.createCookie(name, "", -1);
        }
    };

    function whichTransitionEvent(){
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition':'transitionend',
            'OTransition':'oTransitionEnd',
            'MozTransition':'transitionend',
            'WebkitTransition':'webkitTransitionEnd'
        }

        for(t in transitions){
            if( el.style[t] !== undefined ){
                return transitions[t];
            }
        }
    }

    return {
        cookie: Cookies,
        transitionEvent: whichTransitionEvent()
    };
}();

;(function(window, $) {
    'use strict';

        function init() {
            $('[data-unlock]').on('click', function(e) {
                if ($(window).width() <= 660) {
                    $('html,body').animate({'scrollTop': 0}, 300, function() {
                        initModal();
                    });
                } else {
                    initModal();
                }

    /*
    *
    *
    *      OPTIONS
    *
    *
    * */
                var options = {
                    sharingTitle: 'Look at this incredible giveaway!',
                    mailchimp: {
                        apikey: '7d6073a44d2bf1cb9843cad7b051978d-us4',
                        listId: '86daffae68'
                    },
                    emailShareTimeout: 10, // seconds
                    linkedinShareTimeout: 10
                };

    /*
    *
    *
    * OPTIONS END
    *
    *
    * */

                bindEvents(options);

                function initModal() {
                    $('#shareModal').modal({backdrop: 'static', keyboard: false});
                }

                e.preventDefault();
            });
        }

    function bindEvents(options) {
        var $modal = $('#shareModal'),
            $body = $('body'),
            $subscribeField = $modal.find('[data-action-field]'),
            $subscribe = $modal.find('[data-action-button=subscribe]'),
            $shareTwitter = $modal.find('[data-action-button=share-twitter]'),
            $shareEmail = $modal.find('[data-action-button=share-email]'),
            $shareLinkedin = $modal.find('[data-action-button=share-linkedin]'),
            $shareText = $modal.find('[data-share-text=true]'),
            $noShareDismiss = $modal.find('[data-action-button=no-share-dismiss]'),
            $validationBlock = $modal.find('.popup__input-error'),
            $sharingLinkInput = $modal.find('[data-action=sharing-link]');

        var emailRegexp = new RegExp("^(\\S+)@([a-z0-9-]+)(\\.)([a-z]{2,4})(\\.?)([a-z]{0,4})+$", 'mi'),
            sharingLink = $sharingLinkInput.val(),
            sharingText = $shareText.attr('placeholder');

        updateShareLinks();
        bindBackdropModalClose();

        // Blocks hover
        $('.block-wrap').on('hover', function() {
            $(this).addClass('block-wrap--hover');
        }, function() {
            $(this).removeClass('block-wrap--hover');
        });

        // Email submit handler
        $subscribe
            .on('click', function(e) {
                var fieldVal = $subscribeField.val(),
                    mailchimpLink = 'https://us4.api.mailchimp.com/2.0/lists/subscribe/';

                if (emailRegexp.test(fieldVal)) {

                    unbindBackdropModalClose();

                    mailchimpLink += '?apikey=' + options.mailchimp.apikey +
                                      '&id=' + options.mailchimp.listId +
                                      '&email[email]=' + fieldVal;

                    $body.append('<iframe style="position: fixed; top: -1px; visibility: hidden; ' +
                                    'height: 0; width: 0;" height="0" width="0" src="'+ mailchimpLink +'"/>');

                    animatePopupScreens('[data-popup-content=email]', '[data-popup-content=share]', false,
                            function() {$shareText.focus()}
                    );

                } else {
                    $validationBlock.show();
                }

                e.preventDefault();
            });


        // Share popup close handler
        $modal.find('[data-popup-content=share] .close').on('click', function(e) {
            animatePopupScreens('[data-popup-content=share]', '[data-popup-content=no-share]');
        });

        // Email field changes handler
        $subscribeField.on('keydown', function(e) {
            $validationBlock.hide();

            if (e.keyCode === 13) {
                $subscribe.trigger('click');
                e.preventDefault();
            }
        });

        // Linkedin share button handler
        $shareLinkedin.on('click', function(e) {
            setTimeout(function() {
                shareHandler('email');
            }, options.linkedinShareTimeout * 1000);
        });

        // Twitter share button handler
        $shareTwitter.on('click', function(e) {
            if (!window.twttr) {
                alert('Sorry, looks like Twitter is broken! :(');
                return;
            }


            e.preventDefault();
        });

        // Email share button handler
        $shareEmail.on('click', function(e) {
            setTimeout(function() {
                shareHandler('email');
            }, options.emailShareTimeout * 1000);
        });

        // Share text change handler
        $shareText.on('keyup', function() {
            sharingText = $(this).val();
            updateShareLinks();
        });

        // No share dismiss handler
        $noShareDismiss.on('click', noShareHandler);

        // Sharing link input handler
        $sharingLinkInput.on({
            'focus': function() {
                $(this).select();
            },
            'click': function() {
                $(this).select();
            },
            'keyup': function() {
                if ($(this).val() !== sharingLink)
                    $(this).val(sharingLink);

                $(this).select();
            },
            'keydown': function() {
                $(this).select();
            }
        });


        // Sharing handler
        function shareHandler(type) {
            // add tracking code here
            console.log( 'shgare' );
            unlockPacks();
        }

        // No share dismiss handler
        function noShareHandler() {
            console.log('no share unlock');
            unlockPacks();
        }

        // Make popup dismissable with backdrop click / escape button press
        function bindBackdropModalClose() {
            $body.on('click.modal-control', '.modal-backdrop', function(){
                $modal.modal('hide');
            });

            $body.on('keyup.modal-control', function(e){
                if (e.keyCode === 27)
                    $modal.modal('hide');
            });
        }

        // Disable popup closing with backdrop click / escape button press
        function unbindBackdropModalClose() {
            $body.off('.modal-control');
        }

        // Twitter share handler
        twttr.ready(function (twttr) {
            twttr.events.bind('tweet', function() {
                shareHandler('twitter');
            });
        });

        // Update share links if sharing text has changed
        function updateShareLinks() {
            $shareTwitter.attr('href', buildTwitterUrl());
            $shareLinkedin
                .attr('href', buildLinkedinUrl())
                .attr('target', '_blank');

            $shareEmail
                .attr('href', buildEmailUrl())
                .attr('target', '_blank');
        }


        // Sharing links updaters
        function buildTwitterUrl() {
            return 'https://twitter.com/intent/tweet?text=' + sharingText + '&url=' + window.location.toString();
        }

        function buildLinkedinUrl() {
            return 'https://www.linkedin.com/shareArticle?mini=true' +
                '&url='+ encodeURIComponent(window.location.toString()) +
                '&title=' + encodeURIComponent(options.sharingTitle) +
                '&summary='+ encodeURIComponent(sharingText)
        }

        function buildEmailUrl() {
            return 'mailto:?subject=' +
                options.sharingTitle +
                '&body=' + sharingText + ' ' +
                window.location.toString();
        }


        // Popup screens animation
        function animatePopupScreens(fromSelect, toSelector, callbackFrom, callbackTo) {
            var $from = $modal.find(fromSelect),
                $to = $modal.find(toSelector);

            $from.addClass('fadeOutLeft absolute');

            if (utilities.transitionEvent)
                $from.one(utilities.transitionEvent, fromAnimationEndHandler);
            else
                setTimeout(fromAnimationEndHandler, 200);


            $to.removeClass('hidden');

            if (utilities.transitionEvent)
                $to.one(utilities.transitionEvent, toAnimationEndHandler);
            else
                setTimeout(toAnimationEndHandler, 200);

            function fromAnimationEndHandler() {
                if (typeof callbackFrom === 'function')
                    callbackFrom();
            }

            function toAnimationEndHandler() {
                if (typeof callbackTo === 'function')
                    callbackTo();
            }
        }
    }

    $(function() {
        init();
    });

    function unlockPacks() {
        utilities.cookie.createCookie('features_unlocked', true, 7);
        location.reload();
    }
})(window, jQuery);

