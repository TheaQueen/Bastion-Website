// Small screen size
const mq = window.matchMedia('(max-width: 899px)');

// Hides navbar on screen size change (small screen devices)
mq.addListener(widthChange);
widthChange(mq);

function widthChange(mq) {
  let nav = document.getElementsByTagName('nav')[0];
  if (mq.matches) {
    nav.setAttribute('hidden', true);
  }
  else {
    nav.removeAttribute('hidden');
  }
  let innerHeader = document.getElementsByClassName('innerHeader')[0];
  innerHeader.style['background-color'] = 'transparent';
  innerHeader.style['padding-bottom'] = '0';
}

// Toggle's nav (small screen devices)
function toggleNav() {
  if (mq.matches) {
    let nav = document.getElementsByTagName('nav')[0];
    if (nav.hasAttribute('hidden')) {
      nav.removeAttribute('hidden');
      let innerHeader = document.getElementsByClassName('innerHeader')[0];
      innerHeader.style['background-color'] = 'rgba(0,0,0,.8)';
      innerHeader.style['padding-bottom'] = '10px';
    }
    else {
      nav.setAttribute('hidden', true);
      let innerHeader = document.getElementsByClassName('innerHeader')[0];
      innerHeader.style['background-color'] = 'transparent';
      innerHeader.style['padding-bottom'] = '0';
    }
  }
}

// Show inner nav (large screen devices)
function showInnerNav() {
  let element = document.getElementById('headerNavInner');
  element.style.display = 'table';
}
// Hide inner nav (large screen devices)
function hideInnerNav() {
  let element = document.getElementById('headerNavInner');
  element.style.display = 'none';
}

// Show back-to-top toolbar
function showBTTToolbar() {
  const mq = window.matchMedia('(min-width: 900px)');
  if (mq.matches) {
    let element = document.getElementById('back-to-top-text');
    if (element.hasAttribute('hidden')) {
      element.removeAttribute('hidden');
    }
  }
}
// Hide back-to-top toolbar
function hideBTTToolbar() {
  const mq = window.matchMedia('(min-width: 900px)');
  if (mq.matches) {
    let element = document.getElementById('back-to-top-text');
    if (!element.hasAttribute('hidden')) {
      element.setAttribute('hidden', true);
    }
  }
}

// Highlights lagline
function taglineHighlight(state) {
  let element = document.getElementById('tagline');
  if (state === 1) {
    element.style.opacity = .8;
  }
  else {
    element.style.opacity = .5;
  }
}

// Update tagline for 'Join Discord' button
function taglineJoin() {
  let element = document.getElementById('tagline');
  element.innerHTML = 'Test it before you use it.';
  element.style.opacity = .8;
}
// Update tagline for 'Add to Discord' button
function taglineAdd() {
  let element = document.getElementById('tagline');
  element.innerHTML = 'Give awesome perks to your Discord server!';
  element.style.opacity = .5;
}

/**
 * Autofetch commands
 */
let commands;
let mdToHTML = new showdown.Converter();
$.ajax({
  url: 'https://raw.githubusercontent.com/TheBastionBot/Bastion/master/locales/en/modules.json',
  dataType: 'json',
  failure: function(err) {
    console.log(err);
  },
  success: function(commands) {
    let makeTag = function(openTag, closeTag) {
      return function(content){
        return openTag+content+closeTag;
      };
    };
    let tr = makeTag('<tr>', '</tr>');
    let td = makeTag('<td>', '</td>');

    for (let module of Object.keys(commands)) {
      insertBasicTable(commands[module], module);
    }

    function insertBasicTable(data, id) {
      $('.cmd-table').append(
          Object.keys(data).reduce(function(o, n) {
            return o + tr(td(`<code>${n}</code>`) + '' + td(id.charAt(0).toUpperCase() + id.replace(/_/, ' ').slice(1)) + '' + td(mdToHTML.makeHtml(data[n]) + ''));
          }, '')
      );
    };
    setupDataTable();
  }
});

// setup DataTables with #commandsTable table
function setupDataTable() {
  dataTable = $('#commandsTable').DataTable({
    sDom: 'rt<"bottom"ip>',
    autoWidth: false,
    lengthMenu:[25],
		language: {
      select: "_INPUT_",
      infoFiltered: " | Filtered: _TOTAL_",
      info: "Page: _PAGE_/_PAGES_ | Commands: _MAX_",
      zeroRecords: "No commands matched your search",
      sEmptyTable: "No commands found",
      oPaginate: {
        sFirst: "←",
        sPrevious: "←",
        sNext: "→",
        sLast: "→"
      }
    }
  });
  $('#commandsSearch').keyup(function(){ dataTable.search($(this).val()).draw();})
};

/**
 * Back to top
 */
function getScrollXY() {
  let scrOfX = 0, scrOfY = 0;
  if (typeof window.pageYOffset === 'number') {
    //Netscape compliant
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  }
  else if (document.body && (document.body.scrollLeft || document.body.scrollTop)) {
    //DOM compliant
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  }
  else if (document.documentElement && (document.documentElement.scrollLeft || document.documentElement.scrollTop)) {
    //IE6 standards compliant mode
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [ scrOfX, scrOfY ];
}

function getDocHeight() {
  let D = document;
  return Math.max(
    D.body.scrollHeight, D.documentElement.scrollHeight,
    D.body.offsetHeight, D.documentElement.offsetHeight,
    D.body.clientHeight, D.documentElement.clientHeight
  );
}

document.addEventListener('scroll', function (event) {
  let backToTopButton = document.getElementById('back-to-top');
  if (getScrollXY()[1] >= Math.max(document.documentElement.clientHeight, window.innerHeight || 0)) {
    if (backToTopButton.hasAttribute('hidden')) {
      backToTopButton.removeAttribute('hidden');
    }
  }
  else {
    if (!backToTopButton.hasAttribute('hidden')) {
      backToTopButton.setAttribute('hidden', true);
    }
  }
});

/**
 * @function updatePage
 * @param {String} hash
 * @returns {void}
 */
function updatePage(hash) {
  let section = document.getElementById(hash);
  if (!section) {
    section = document.getElementById('e404');
  }
  if (section.hasAttribute('hidden')) {
    let sections = document.getElementsByTagName('section');
    for (let section of sections) {
      section.setAttribute('hidden', true);
    }
    section.removeAttribute('hidden');
  }
  widthChange(mq);
}

/**
 * Smooth scrolling b/w anchors
 */
let $root = $('html, body'); // Cache `html` & `body` selectors for increased performance, so that it doesn't run every single time an anchor is clicked
$('#back-to-top').click(function() {
  $root.animate({
    scrollTop: 0
  }, 500);
  return false; // Don't update the URL hash
});
