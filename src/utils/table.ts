import HtmlToMdService from 'turndown'

// 获取表格对齐信息
function getTableAlignments(tableRow: any) {
    return Array.from(tableRow.children).map(function (cell: any) {
        const align = cell.getAttribute('align') || '';
        return align.toLowerCase() === 'right' ? '---:' :
            align.toLowerCase() === 'center' ? ':---:' : '---';
    });
}

export function htmlTableToMd(htmlToMdService: HtmlToMdService) {
    // 添加对表格的转换规则
    htmlToMdService.addRule('table', {
        filter: ['table'],
        replacement: function (content) {
            return content.trim();
        }
    });
    htmlToMdService.addRule('tbody', {
        filter: ['tbody'],
        replacement: function (content) {
            return content.trim();
        }
    });
    htmlToMdService.addRule('thead', {
        filter: ['thead'],
        replacement: function (content) {
            return content.trim() + "\n";
        }
    });

    htmlToMdService.addRule('tableRow', {
        filter: function (node) {
            return node.nodeName === 'TR' && node.parentNode?.nodeName === 'TBODY';
        },
        replacement: function (content) {
            return '\n' + content.trim() + '|';
        }
    });

    htmlToMdService.addRule('tableHeader', {
        filter: function (node) {
            return node.nodeName === 'TR' && node.parentNode?.nodeName === 'THEAD';
        },
        replacement: function (content, node) {
            const align = getTableAlignments(node);
            return content.trim() + '|\n|' + align.join('|') + '|';
        }
    });

    htmlToMdService.addRule('tableCell', {
        filter: ['th', 'td'],
        replacement: function (content) {
            return '|' + content.trim().replaceAll('|', "\\|");
        }
    });
}