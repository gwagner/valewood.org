import fs from 'fs';
import path from 'path';

export default class BuildTools {
    findFilesByExtension(p, ext, filter) {
        ext = cleanExtensions(ext);
        if (ext.length == 0) {
            return [];
        }

        return FindFilesByExtension(p, ext, cleanFilter(filter));
    }
    readFile(root, file) {
        var filename = path.join(root, file);
        return fs.readFileSync(filename).toString();
    }
    writeFileSync(path, contents) {
        try {
            fs.writeFileSync(path, contents)
            return true
        } catch (err) {
            console.log("Error saving file "+path+": "+err)
            return false
        }
    }
};


function FindFilesByExtension(p, ext, filter) {
    if (!fs.existsSync(p)) {
        console.log("Could not find folder: ", p);
        return;
    }

    var files = fs.readdirSync(p);
    var found = [];
    for (var i = 0; i < files.length; i++) {
        var filename = path.join(p, files[i]);
        var stat = fs.lstatSync(filename);

        if (isFiltered(filename, filter)) {
            continue;
        }

        if (stat.isDirectory()) {
            var recursed = FindFilesByExtension(filename, ext, filter);
            for (var j = 0; j < recursed.length; j++) {
                recursed[j] = path.join(files[i], recursed[j]).replace(/\\/g, "/");
            }
            found.push.apply(found, recursed);
        }
        else if (isValidExtension(filename, ext)) {
            found.push(files[i]);
        };
    };
    return found;
};

function isFiltered(filename, filter) {
    if (filter.length == 0) {
        return false;
    }

    for (var i = 0; i < filter.length; i++) {
        if (filename.includes(filter[i])) {
            return true;
        }
    }

    return false;
}

function isValidExtension(filename, ext) {
    return ext.includes(filename.toLowerCase().split('.').pop());
}

function cleanFilter(filter) {
    if (!Array.isArray(filter)) {
        filter = [filter]
    }

    return filter
}

function cleanExtensions(ext) {
    if (!Array.isArray(ext)) {
        ext = [ext]
    }
    for (var i = 0; i < ext.length; i++) {
        if (ext[i].includes('.')) {
            ext[i] = ext[i].split().pop()
        }
    }

    var cleanExt = [];
    for (var i = 0; i < ext.length; i++) {
        if (ext[i].length > 0) {
            cleanExt.push(ext[i])
        }
    }

    return cleanExt
}
