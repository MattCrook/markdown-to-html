// const converter = new showdown.Converter(),
//     text      = '# hello, markdown!',
//     html      = converter.makeHtml(text);

const parseMarkdown = markdown => {
  // h tags
  // replace return new string, first arg is regex, second is new string it replaces to "nth" degree
  markdown = markdown.replace(/[\#]{6}(.+)/g, "<h6>$1</h6>");
  markdown = markdown.replace(/[\#]{5}(.+)/g, "<h5>$1</h5>");
  markdown = markdown.replace(/[\#]{4}(.+)/g, "<h4>$1</h4>");
  markdown = markdown.replace(/[\#]{3}(.+)/g, "<h3>$1</h3>");
  markdown = markdown.replace(/[\#]{2}(.+)/g, "<h2>$1</h2>");
  markdown = markdown.replace(/[\#]{1}(.+)/g, "<h1>$1</h1>");

  //alt h
  markdown = markdown.replace(/^(.+)\n\=+/gm, "<h1>$1</h1>");
  markdown = markdown.replace(/^(.+)\n\-+/gm, "<h2>$1</h2>");

  // ul
  markdown = markdown.replace(/^\s*\n\*/gm, "<ul>\n*");
  markdown = markdown.replace(/^(\*.+)\s*\n([^\*])/gm, "$1\n</ul>\n\n$2");
  markdown = markdown.replace(/^\*(.+)/gm, "<li>$1</li>");

  //ol
  markdown = markdown.replace(/^\s*\n\d\./gm, "<ol>\n1.");
  markdown = markdown.replace(/^(\d\..+)\s*\n([^\d\.])/gm, "$1\n</ol>\n\n$2");
  markdown = markdown.replace(/^\d\.(.+)/gm, "<li>$1</li>");

  // code block
  markdown = markdown.replace(/[\`]{1}([^\`]+)[\`]{1}/g, "<code>$1</code>");
  markdown = markdown.replace(/^\>(.+)/gm, "<blockquote>$1</blockquote>");

  // paragraphs
  markdown = markdown.replace(/^\s*(\n)?(.+)/gm, m => {
    return /\<(\/)?(h\d|ul|ol|li|blockquote|pre|img)/.test(m)
      ? m
      : "<p>" + m + "</p>";
  });

  // fonts (bold-italics)
  markdown = markdown.replace(/[\*\_]{2}([^\*\_]+)[\*\_]{2}/g, "<b>$1</b>");
  markdown = markdown.replace(/[\*\_]{1}([^\*\_]+)[\*\_]{1}/g, "<i>$1</i>");
  markdown = markdown.replace(/[\~]{2}([^\~]+)[\~]{2}/g, "<del>$1</del>");

  //links
  markdown = markdown.replace(
    /[\[]{1}([^\]]+)[\]]{1}[\(]{1}([^\)\"]+)(\"(.+)\")?[\)]{1}/g,
    '<a href="$2" title="$4">$1</a>'
  );

  //images
  markdown = markdown.replace(
    /\!\[([^\]]+)\]\(([^\)]+)\)/g,
    '<img src="$2" alt="$1" />'
  );

  //pre
  markdown = markdown.replace(/^\s*\n\`\`\`(([^\s]+))?/gm, '<pre class="$2">');
  markdown = markdown.replace(/^\`\`\`\s*\n/gm, "</pre>\n\n");
  //strip p from pre
  markdown = markdown.replace(/(\<pre.+\>)\s*\n\<p\>(.+)\<\/p\>/gm, "$1$2");

  return markdown;
};

let rawMode = true;
let markdownElement = document.getElementById("markdown");
let outputElement = document.getElementById("output-html");
const parse = () => {
  outputElement[rawMode ? "innerText" : "innerHTML"] = parseMarkdown(
    markdownElement.innerText);
};
parse();
markdownElement.addEventListener("keyup", parse, false);

//Raw Mode Trigger Button
(function() {
  let switchModeButton = document.getElementById("raw-switch"),
    status = switchModeButton.getElementsByTagName("span")[0];
  const updateStatus = () => {
    status.innerText = rawMode ? "On" : "off";
  };
  updateStatus();
  switchModeButton.addEventListener(
    "click",
    event => {
      event.preventDefault();
      rawMode = rawMode ? false : true;
      updateStatus();
      parse();
    },
    false
  );
})();
