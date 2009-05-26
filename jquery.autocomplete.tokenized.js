// Usage:
// ------
// 
//   $("#text_field").autocomplete(['foo', 'bar', 'baz'], {split: /,\s?/});
// 
// License:
// --------
// 
// The MIT License, see README
// 
// Copyright (c) 2009 Edithouse eLabs AB

(function($) {
  
  $.fn.autocomplete = function(list, opt) {
    opt = $.extend({}, {
      activeClass: 'active',
      listClass: 'autocomplete',
      minChars: 1,
      split: undefined
    }, opt);

    var KEY = {
      BACKSPACE: 8,
      TAB: 9,
      RETURN: 13,
      ESCAPE: 27,
      LEFT: 37,
      UP: 38,
      RIGHT: 39,
      DOWN: 40
    };
    var NAV_KEYS = [KEY.TAB, KEY.RETURN, KEY.ESCAPE, KEY.LEFT, KEY.UP, KEY.RIGHT, KEY.DOWN];
    
    return this.each(function() {
      var self = $(this);
      var ul = $('<ul class="' + opt.listClass + '"></ul>');
      var results = [];
      var selected = 0;
      
      self.attr('autocomplete', 'off');
      
      var last_token = function() {
        if(opt.split) {
          var tokens = (self.val() + 'x').split(opt.split);
          var word = tokens[tokens.length-1];
          return word.replace(/x$/, '');
        } else {
          return self.val();
        }
      };
      
      var select = function() {
        ul.find('li').removeClass(opt.activeClass).slice(selected, selected + 1).addClass(opt.activeClass);                
      };
      
      var reset = function() {
        ul.empty();
        selected = 0;
        results = [];
        ul.hide();
      };
      reset();
      
      var search = function() {
        reset();
        var query = last_token().toLowerCase();
        
        if (query.length >= opt.minChars) {
          
          $(list).each(function() {
            if(this.toLowerCase().substring(0, query.length) == query) {
              results.push(this);
              ul.append('<li>' + this + '</li>');
            }
          });

          if(results.length > 0) {
            select();

            var offset = self.offset();
            ul.css({top: offset.top + self.outerHeight(), left: offset.left, width: self.outerWidth()});
            ul.show();
          }
        }
      };
      
      self.after(ul);
      
      self.keydown(function(e) {
        if(e.which == KEY.TAB || e.which == KEY.RETURN) {
          if(results.length > 0) {
            var current_text = self.val();
            var last_word = last_token();
            var new_text = current_text.substring(0, current_text.length-last_word.length) + results[selected];
            self.val(new_text);
            search();
          }
        } else if(e.which == KEY.ESCAPE) {
          reset();
        } else if(e.which == KEY.DOWN && (selected + 1 < results.length)) {
          selected++;
          select();
        } else if(e.which == KEY.UP) {
          if(selected > 0) {
            selected--;
            select();
          }
        } else {
          return true;
        }
        
        return false;
      });
      
      self.keyup(function(e) {
        if($(NAV_KEYS).index(e.which) == -1) search();
      });
      
      self.blur(reset);
      
    });
    
  };
  
})(jQuery);