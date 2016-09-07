$(function () {
    var input = {
        "name": "files",
        "type": "folder",
        "path": "files",
        "items": [{
            "name": "Archives",
            "type": "folder",
            "path": "files\/Archives",
            "items": [{
                "name": "7z",
                "type": "folder",
                "path": "files\/Archives\/7z",
                "items": [{
                    "name": "archive.7z",
                    "type": "file",
                    "path": "files\/Archives\/7z\/archive.7z",
                    "size": 257
                }]
            }, {
                "name": "targz",
                "type": "folder",
                "path": "files\/Archives\/targz",
                "items": [{
                    "name": "archive.tar.gz",
                    "type": "file",
                    "path": "files\/Archives\/targz\/archive.tar.gz",
                    "size": 10074
                }]
            }, {
                "name": "zip",
                "type": "folder",
                "path": "files\/Archives\/zip",
                "items": [{
                    "name": "archive.zip",
                    "type": "file",
                    "path": "files\/Archives\/zip\/archive.zip",
                    "size": 10133
                }]
            }]
        }, {
            "name": "Important Documents",
            "type": "folder",
            "path": "files\/Important Documents",
            "items": [{
                "name": "Microsoft Office",
                "type": "folder",
                "path": "files\/Important Documents\/Microsoft Office",
                "items": [{
                    "name": "Geography.doc",
                    "type": "file",
                    "path": "files\/Important Documents\/Microsoft Office\/Geography.doc",
                    "size": 4096
                }, {
                    "name": "Table.xls",
                    "type": "file",
                    "path": "files\/Important Documents\/Microsoft Office\/Table.xls",
                    "size": 204800
                }]
            }, {"name": "export.csv", "type": "file", "path": "files\/Important Documents\/export.csv", "size": 4096}]
        }, {
            "name": "Movies",
            "type": "folder",
            "path": "files\/Movies",
            "items": [{
                "name": "Conan The Librarian.mkv",
                "type": "file",
                "path": "files\/Movies\/Conan The Librarian.mkv",
                "size": 0
            }]
        }, {
            "name": "Music",
            "type": "folder",
            "path": "files\/Music",
            "items": [{
                "name": "awesome soundtrack.mp3",
                "type": "file",
                "path": "files\/Music\/awesome soundtrack.mp3",
                "size": 10240000
            }, {
                "name": "hello world.mp3",
                "type": "file",
                "path": "files\/Music\/hello world.mp3",
                "size": 204800
            }, {
                "name": "u2",
                "type": "folder",
                "path": "files\/Music\/u2",
                "items": [{
                    "name": "Unwanted Album",
                    "type": "folder",
                    "path": "files\/Music\/u2\/Unwanted Album",
                    "items": [{
                        "name": "track1.mp3",
                        "type": "file",
                        "path": "files\/Music\/u2\/Unwanted Album\/track1.mp3",
                        "size": 204800
                    }, {
                        "name": "track2.mp3",
                        "type": "file",
                        "path": "files\/Music\/u2\/Unwanted Album\/track2.mp3",
                        "size": 204800
                    }, {
                        "name": "track3.mp3",
                        "type": "file",
                        "path": "files\/Music\/u2\/Unwanted Album\/track3.mp3",
                        "size": 204800
                    }, {
                        "name": "track4.mp3",
                        "type": "file",
                        "path": "files\/Music\/u2\/Unwanted Album\/track4.mp3",
                        "size": 204800
                    }]
                }]
            }]
        }, {"name": "Nothing here", "type": "folder", "path": "files\/Nothing here", "items": []}, {
            "name": "Photos",
            "type": "folder",
            "path": "files\/Photos",
            "items": [{
                "name": "pic1.jpg",
                "type": "file",
                "path": "files\/Photos\/pic1.jpg",
                "size": 204800
            }, {
                "name": "pic2.jpg",
                "type": "file",
                "path": "files\/Photos\/pic2.jpg",
                "size": 204800
            }, {
                "name": "pic3.png",
                "type": "file",
                "path": "files\/Photos\/pic3.png",
                "size": 204800
            }, {
                "name": "pic4.gif",
                "type": "file",
                "path": "files\/Photos\/pic4.gif",
                "size": 204800
            }, {"name": "pic5.jpg", "type": "file", "path": "files\/Photos\/pic5.jpg", "size": 204800}]
        }, {"name": "Readme.html", "type": "file", "path": "files\/Readme.html", "size": 344}]
    }

    localStorage.setItem("dir", JSON.stringify(input));

    var filemanager = $('.filemanager'),
        breadcrumbs = $('.breadcrumbs'),
        fileList = filemanager.find('.data');
    var data = JSON.parse(localStorage.getItem("dir"));
    var response = [data],
        currentPath = '',
        breadcrumbsUrls = [];

    var folders = [],
        files = [];

    // This event listener monitors changes on the URL. We use it to
    // capture back/forward navigation in the browser.

    $(window).on('hashchange', function () {

        goto(window.location.hash);

        // We are triggering the event. This will execute 
        // this function on page load, so that we show the correct folder:

    }).trigger('hashchange');


    // Hiding and showing the search box

    filemanager.find('.search').click(function () {

        var search = $(this);

        search.find('span').hide();
        search.find('input[type=search]').show().focus();

    });


    // Listening for keyboard input on the search field.
    // We are using the "input" event which detects cut and paste
    // in addition to keyboard input.

    filemanager.find('input').on('input', function (e) {

        folders = [];
        files = [];

        var value = this.value.trim();

        if (value.length) {

            filemanager.addClass('searching');

            // Update the hash on every key stroke
            window.location.hash = 'search=' + value.trim();

        } else {

            filemanager.removeClass('searching');
            window.location.hash = encodeURIComponent(currentPath);

        }

    }).on('keyup', function (e) {

        // Clicking 'ESC' button triggers focusout and cancels the search

        var search = $(this);

        if (e.keyCode == 27) {

            search.trigger('focusout');

        }

    }).focusout(function (e) {

        // Cancel the search

        var search = $(this);

        if (!search.val().trim().length) {

            window.location.hash = encodeURIComponent(currentPath);
            search.hide();
            search.parent().find('span').show();

        }

    });

    function uploadFolderFile(dir, uploadTo, folder, file, size) {
        dir.forEach(function (d) {
            if (d.path === uploadTo) {
                var folderPath = uploadTo + "/" + folder;
                var newFolder = new Object();
                newFolder.name = folder;
                newFolder.path = folderPath;
                newFolder.type = "folder";
                newFolder.items = new Array();
                newFolder.items[0] = {
                    name: file,
                    path: folderPath + "/" + file,
                    size: size,
                    type: "file"
                };
                d.items.push(newFolder);
                render(new Array(newFolder, d.items));
            } else if (d.type === "folder") {
                uploadFolderFile(d.items, uploadTo, folder, file);
            }
        });
    }

    // Add Data from the user to the localStorage
    $("#fileUpload").on('change', function (e) {
        var theFiles = e.target.files;
        var relativePath = theFiles[0].webkitRelativePath;
        var size = theFiles[0].size;
        var folder = relativePath.split("/");
        var file = folder[1];
        folder = folder[0];
        var hash = window.location.hash;
        var path = decodeURIComponent(window.location.hash).slice(1).split('=');
        var currentFolder = path.toString().split("/");
        currentFolder = currentFolder[currentFolder.length - 1];
        var dir = response;
        uploadFolderFile(dir, path.toString(), folder, file, size);
    });

    // Clicking on folders

    fileList.on('click', 'li.folders', function (e) {
        e.preventDefault();

        var nextDir = $(this).find('a.folders').attr('href');

        if (filemanager.hasClass('searching')) {

            // Building the breadcrumbs

            breadcrumbsUrls = generateBreadcrumbs(nextDir);

            filemanager.removeClass('searching');
            filemanager.find('input[type=search]').val('').hide();
            filemanager.find('span').show();
        } else {
            breadcrumbsUrls.push(nextDir);
        }

        window.location.hash = encodeURIComponent(nextDir);
        currentPath = nextDir;
    });


    // Clicking on breadcrumbs

    breadcrumbs.on('click', 'a', function (e) {
        e.preventDefault();

        var index = breadcrumbs.find('a').index($(this)),
            nextDir = breadcrumbsUrls[index];

        breadcrumbsUrls.length = Number(index);

        window.location.hash = encodeURIComponent(nextDir);

    });


    // Navigates to the given hash (path)

    function goto(hash) {
        //TODO: 2 : Uncomment and modify below code:
        // Below code should save current updated directory structure to locate storage.
        // localStorage.setItem("dir", JSON.stringify(response));
        hash = decodeURIComponent(hash).slice(1).split('=');

        if (hash.length) {
            var rendered = '';

            // if hash has search in it

            if (hash[0] === 'search') {

                filemanager.addClass('searching');
                rendered = searchData(response, hash[1].toLowerCase());

                if (rendered.length) {
                    currentPath = hash[0];
                    render(rendered);
                } else {
                    render(rendered);
                }
                localStorage.setItem("dir", JSON.stringify(rendered));
            }

            // if hash is some path
            else if (hash[0].trim().length) {

                rendered = searchByPath(hash[0]);

                if (rendered.length) {

                    currentPath = hash[0];
                    breadcrumbsUrls = generateBreadcrumbs(hash[0]);
                    render(rendered);

                } else {
                    currentPath = hash[0];
                    breadcrumbsUrls = generateBreadcrumbs(hash[0]);
                    render(rendered);
                }
                localStorage.setItem("dir", JSON.stringify(rendered));
            }

            // if there is no hash
            else {
                currentPath = data.path;
                breadcrumbsUrls.push(data.path);
                render(searchByPath(data.path));
                localStorage.setItem("dir", JSON.stringify(data));
            }
        }
    }

    // Splits a file path and turns it into clickable breadcrumbs

    function generateBreadcrumbs(nextDir) {
        var path = nextDir.split('/').slice(0);
        for (var i = 1; i < path.length; i++) {
            path[i] = path[i - 1] + '/' + path[i];
        }
        return path;
    }


    // Locates a file by path

    function searchByPath(dir) {
        var path = dir.split('/'),
            demo = response,
            flag = 0;

        for (var i = 0; i < path.length; i++) {
            for (var j = 0; j < demo.length; j++) {
                if (demo[j].name === path[i]) {
                    flag = 1;
                    demo = demo[j].items;
                    break;
                }
            }
        }

        demo = flag ? demo : [];
        return demo;
    }


    // Recursively search through the file tree

    function searchData(data, searchTerms) {

        data.forEach(function (d) {
            if (d.type === 'folder') {

                searchData(d.items, searchTerms);

                if (d.name.toLowerCase().match(searchTerms)) {
                    folders.push(d);
                }
            } else if (d.type === 'file') {
                if (d.name.toLowerCase().match(searchTerms)) {
                    files.push(d);
                }
            }
        });
        return {folders: folders, files: files};
    }


    // Render the HTML for the file manager

    function render(data) {

        var scannedFolders = [],
            scannedFiles = [];

        if (Array.isArray(data)) {

            data.forEach(function (d) {

                if (d.type === 'folder') {
                    scannedFolders.push(d);
                } else if (d.type === 'file') {
                    scannedFiles.push(d);
                }

            });

        } else if (typeof data === 'object') {

            scannedFolders = data.folders;
            scannedFiles = data.files;

        }


        // Empty the old result and make the new one

        fileList.empty().hide();

        if (!scannedFolders.length && !scannedFiles.length) {
            filemanager.find('.nothingfound').show();
        } else {
            filemanager.find('.nothingfound').hide();
        }

        if (scannedFolders.length) {

            scannedFolders.forEach(function (f) {

                var itemsLength = f.items.length,
                    name = escapeHTML(f.name),
                    icon = '<span class="icon folder"></span>';

                if (itemsLength) {
                    icon = '<span class="icon folder full"></span>';
                }

                if (itemsLength == 1) {
                    itemsLength += ' item';
                } else if (itemsLength > 1) {
                    itemsLength += ' items';
                } else {
                    itemsLength = 'Empty';
                }

                var folder = $('<li class="folders"><a href="' + f.path + '" title="' + f.path + '" class="folders">' + icon + '<span class="name">' + name + '</span> <span class="details">' + itemsLength + '</span></a></li>');
                folder.appendTo(fileList);
            });

        }

        if (scannedFiles.length) {

            scannedFiles.forEach(function (f) {

                var fileSize = bytesToSize(f.size),
                    name = escapeHTML(f.name),
                    fileType = name.split('.'),
                    icon = '<span class="icon file"></span>';

                fileType = fileType[fileType.length - 1];

                icon = '<span class="icon file f-' + fileType + '">.' + fileType + '</span>';

                var file = $('<li class="files"><a href="' + f.path + '" title="' + f.path + '" class="files">' + icon + '<span class="name">' + name + '</span> <span class="details">' + fileSize + '</span></a></li>');
                file.appendTo(fileList);
            });

        }


        // Generate the breadcrumbs

        var url = '';

        if (filemanager.hasClass('searching')) {

            url = '<span>Search results: </span>';
            fileList.removeClass('animated');

        } else {

            fileList.addClass('animated');

            breadcrumbsUrls.forEach(function (u, i) {

                var name = u.split('/');

                if (i !== breadcrumbsUrls.length - 1) {
                    url += '<a href="' + u + '"><span class="folderName">' + name[name.length - 1] + '</span></a> <span class="arrow">→</span> ';
                } else {
                    url += '<span class="folderName">' + name[name.length - 1] + '</span>';
                }

            });

        }

        breadcrumbs.text('').append(url);


        // Show the generated elements

        fileList.animate({'display': 'inline-block'});

    }


    // This function escapes special html characters in names

    function escapeHTML(text) {
        return text.replace(/\&/g, '&amp;').replace(/\</g, '&lt;').replace(/\>/g, '&gt;');
    }


    // Convert file sizes from bytes to human readable units

    function bytesToSize(bytes) {
        var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        if (bytes === 0) return '0 Bytes';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
    }

});