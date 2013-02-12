/**
 * Created by 23rd and Walnut
 * www.23andwalnut.com
 * User: Saleem El-Amin
 * Date: 5/5/11
 * Time: 6:47 PM
 */

$(document).ready(function(){

    var myMediaBox, switcherOptions, mainAnchor = '#media-content-area', $mainAnchor = $(mainAnchor), $main = $('#main'),
            $contentControls = $('#content-controls'), $contentHeader = $('#media-content-header'), $bottom = $('#bottom'),
            $contentHeaderText = $contentHeader.find('#header-text'), contentHeaderHeight = $contentHeader.height(),
            $window = $(window);

    function start() {
        var folders = [{name:'Sample Folder', contents:samplePlaylist}];

        myMediaBox = $('#container').ttwMediaBox(samplePlaylist, {
            playerAnchor: '#media-box-player',
            widgets:[
                {
                    widgetName:'Folders',
                    anchor:mainAnchor,
                    data: folders,
                    openFolderAdditionalViews:'ThumbWall,AdvancedList,List',
                    style:'switcher',
                    callback:function(widget) {
                        switcherOptions = widget.options;
                    },
                    openFolderCallback:openFolder,
                    backButtonCallback:function(widget, folder) {
                        setContentHeader('Browsing Media');
                    }
                },
                {
                    widgetName:'Folders',
                    style:'simple',
                    anchor:'#simple-folders',
                    data:folders,
                    openFolderAnchor:mainAnchor,
                    openFolderAdditionalViews:'ThumbWall,AdvancedList,List',
                    useBackButton:true,
                    backButtonCallback:function() {
                        setContentHeader('Browsing Media');
                        myMediaBox.ttwMediaBox('addWidget', switcherOptions);
                    },
                    openFolderCallback:openFolder
                },
                {
                    widgetName:'ThumbList',
                    anchor:'#media-box-thumb-list'
                },
                {
                    widgetName:'Description',
                    anchor:'#media-box-description',
                    autoSize:false,
                    fontSize:'12px'
                },
                {
                    widgetName:'Video',
                    anchor:'#media-box-content',
                    pseudoAnchor:true
                }
            ],
            debug:true,
            debugEvents:true
        });
    }

    function appLayout() {

        var
                $content = $main.find('#media-box-content'),
                $currentMeta = $main.find('#current-meta'),
                windowWidth = $window.width(),
                mainHeight,  currentMetaHeight;

        mainHeight = $window.height() - $('#header').height() - $('#bottom').height();
        currentMetaHeight = mainHeight * .12;
        $main.height(mainHeight);

        if ($currentMeta) {
            $currentMeta.height(currentMetaHeight);
            $currentMeta.find('#current-cover').height(currentMetaHeight).width(currentMetaHeight);
        }

        $('#media-box-description').width(windowWidth);

        $content.width(windowWidth - $('#media-box-sidebar').width()).height(mainHeight).find('#media-content-area').height(mainHeight - $contentHeader.height());

    }

    function switchTabs(tab) {
        var tabMenu, $current = {};//reference to the div holding the widgets for the "now playing" view

        if (tab == 'now-playing') {

            $contentHeader.css({'display': 'none', 'height': 0});

            $mainAnchor.html('<div id="media-box-current"><div id="current-image"></div><div id="current-meta"><div id="current-cover"></div><div id="current-description"></div></div></div>');

            $current = $mainAnchor.find('#media-box-current').css('opacity', 0);

            myMediaBox.ttwMediaBox('removeWidget', mainAnchor);
            appLayout(); // call app layout before the new widgets so they have the correct measurements
            myMediaBox.ttwMediaBox('addWidget', {anchor:'#current-cover', widgetName:'AlbumCover'});
            myMediaBox.ttwMediaBox('addWidget', {anchor:'#current-description', widgetName:'Description', order:'artist, album, title', mediaChangeCallback:addParentheses, resizeCallback:addParentheses}, addParentheses);
            myMediaBox.ttwMediaBox('addWidget', {anchor:'#current-image', widgetName:'BackgroundImage'});

            $current.animate({'opacity':1}, 'fast');
        }
        else {

            $mainAnchor.find('#media-box-current').animate({'opacity':0}, 'fast', function() {
                $(this).remove();
                $contentHeader.css({'height': contentHeaderHeight, 'opacity':1, 'display':'block'});

                appLayout();

                if (tab == 'all-media') {
                    setContentHeader('Browsing Media');
                    myMediaBox.ttwMediaBox('addWidget', switcherOptions);
                }
            });
        }
        appLayout();
    }

    function addParentheses(widget) {
        var album = widget.$element.find('.mb-album p');
        album.html(' &nbsp;&nbsp;(' + album.html() + ')');
    }

    function setContentHeader(text) {
        $contentHeaderText.html(text);
    }

    function moveButtons() {
        $mainAnchor.find('.mb-widget-markup').appendTo($contentControls);
    }

    function openFolder(widget, folder) {
        setContentHeader('Browsing: ' + folder.name);
        moveButtons();
    }

    $('#container').ttwLoadMediaBoxDependencies('ttw-mediabox/dependencies/', start);

    appLayout();

    $(window).resize(function() {
        appLayout();
    });

    $('#mb-tabs .tab, #simple-folders li').live('click', function() {
        switchTabs($(this).attr('id'));
        $(this).addClass('active').parents('#mb-tabs').find('li').not($(this)).removeClass('active');
        
    });

});