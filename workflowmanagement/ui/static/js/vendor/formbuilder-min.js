(function() {
    rivets.binders.input = {
        publishes: !0,
        routine: rivets.binders.value.routine,
        bind: function(a) {
            return a.addEventListener("input", this.publish)
        },
        unbind: function(a) {
            return a.removeEventListener("input", this.publish)
        }
    }, rivets.configure({
        prefix: "rv",
        adapter: {
            subscribe: function(a, b, c) {
                return c.wrapped = function(a, b) {
                    return c(b)
                }, a.on("change:" + b, c.wrapped)
            },
            unsubscribe: function(a, b, c) {
                return a.off("change:" + b, c.wrapped)
            },
            read: function(a, b) {
                return "cid" === b ? a.cid : a.get(b)
            },
            publish: function(a, b, c) {
                return a.cid ? a.set(b, c) : a[b] = c
            }
        }
    })
}).call(this),
function() {
    var a, b, c, d, e, f, g, h, i, j, k, l = {}.hasOwnProperty,
        m = function(a, b) {
            function c() {
                this.constructor = a
            }
            for (var d in b) l.call(b, d) && (a[d] = b[d]);
            return c.prototype = b.prototype, a.prototype = new c, a.__super__ = b.prototype, a
        };
    e = function(a) {
        function b() {
            return g = b.__super__.constructor.apply(this, arguments)
        }
        return m(b, a), b.prototype.sync = function() {}, b.prototype.indexInDOM = function() {
            var a, b = this;
            return a = $(".fb-field-wrapper").filter(function(a, c) {
                return $(c).data("cid") === b.cid
            }), $(".fb-field-wrapper").index(a)
        }, b.prototype.is_input = function() {
            return null != c.inputFields[this.get(c.options.mappings.FIELD_TYPE)]
        }, b
    }(Backbone.DeepModel), d = function(a) {
        function b() {
            return h = b.__super__.constructor.apply(this, arguments)
        }
        return m(b, a), b.prototype.initialize = function() {
            return this.on("add", this.copyCidToModel)
        }, b.prototype.model = e, b.prototype.comparator = function(a) {
            return a.indexInDOM()
        }, b.prototype.copyCidToModel = function(a) {
            return a.attributes.cid = a.cid
        }, b
    }(Backbone.Collection), f = function(a) {
        function b() {
            return i = b.__super__.constructor.apply(this, arguments)
        }
        return m(b, a), b.prototype.className = "fb-field-wrapper", b.prototype.events = {
            "click .subtemplate-wrapper": "focusEditView",
            "click .js-duplicate": "duplicate",
            "click .js-clear": "clear"
        }, b.prototype.initialize = function(a) {
            return this.parentView = a.parentView, this.listenTo(this.model, "change", this.render), this.listenTo(this.model, "destroy", this.remove)
        }, b.prototype.render = function() {
            return this.$el.addClass("response-field-" + this.model.get(c.options.mappings.FIELD_TYPE)).data("cid", this.model.cid).html(c.templates["view/base" + (this.model.is_input() ? "" : "_non_input")]({
                rf: this.model
            })), this
        }, b.prototype.focusEditView = function() {
            return this.parentView.createAndShowEditView(this.model)
        }, b.prototype.clear = function() {
            return this.parentView.handleFormUpdate(), this.model.destroy()
        }, b.prototype.duplicate = function() {
            var a;
            return a = _.clone(this.model.attributes), delete a.id, a.label += " Copy", this.parentView.createField(a, {
                position: this.model.indexInDOM() + 1
            })
        }, b
    }(Backbone.View), b = function(a) {
        function b() {
            return j = b.__super__.constructor.apply(this, arguments)
        }
        return m(b, a), b.prototype.className = "edit-response-field", b.prototype.events = {
            "click .js-add-option": "addOption",
            "click .js-remove-option": "removeOption",
            "click .js-default-updated": "defaultUpdated",
            "input .option-label-input": "forceRender"
        }, b.prototype.initialize = function(a) {
            return this.parentView = a.parentView, this.listenTo(this.model, "destroy", this.remove)
        }, b.prototype.render = function() {
            return this.$el.html(c.templates["edit/base" + (this.model.is_input() ? "" : "_non_input")]({
                rf: this.model
            })), rivets.bind(this.$el, {
                model: this.model
            }), this
        }, b.prototype.remove = function() {
            return this.parentView.editView = void 0, this.parentView.$el.find('[data-target="#addField"]').click(), b.__super__.remove.apply(this, arguments)
        }, b.prototype.addOption = function(a) {
            var b, d, e, f;
            return b = $(a.currentTarget), d = this.$el.find(".option").index(b.closest(".option")), f = this.model.get(c.options.mappings.OPTIONS) || [], e = {
                label: "",
                checked: !1
            }, d > -1 ? f.splice(d + 1, 0, e) : f.push(e), this.model.set(c.options.mappings.OPTIONS, f), this.model.trigger("change:" + c.options.mappings.OPTIONS), this.forceRender()
        }, b.prototype.removeOption = function(a) {
            var b, d, e;
            return b = $(a.currentTarget), d = this.$el.find(".js-remove-option").index(b), e = this.model.get(c.options.mappings.OPTIONS), e.splice(d, 1), this.model.set(c.options.mappings.OPTIONS, e), this.model.trigger("change:" + c.options.mappings.OPTIONS), this.forceRender()
        }, b.prototype.defaultUpdated = function(a) {
            var b;
            return b = $(a.currentTarget), "checkboxes" !== this.model.get(c.options.mappings.FIELD_TYPE) && this.$el.find(".js-default-updated").not(b).attr("checked", !1).trigger("change"), this.forceRender()
        }, b.prototype.forceRender = function() {
            return this.model.trigger("change")
        }, b
    }(Backbone.View), a = function(a) {
        function e() {
            return k = e.__super__.constructor.apply(this, arguments)
        }
        return m(e, a), e.prototype.SUBVIEWS = [], e.prototype.events = {
            "click .js-save-form": "saveForm",
            "click .fb-tabs a": "showTab",
            "click .fb-add-field-types a": "addField"
        }, e.prototype.initialize = function(a) {
            var b;
            return b = a.selector, this.formBuilder = a.formBuilder, this.bootstrapData = a.bootstrapData, null != b && this.setElement($(b)), this.collection = new d, this.collection.bind("add", this.addOne, this), this.collection.bind("reset", this.reset, this), this.collection.bind("change", this.handleFormUpdate, this), this.collection.bind("destroy add reset", this.hideShowNoResponseFields, this), this.collection.bind("destroy", this.ensureEditViewScrolled, this), this.render(), this.collection.reset(this.bootstrapData), this.initAutosave()
        }, e.prototype.initAutosave = function() {
            var a = this;
            return this.formSaved = !0, this.saveFormButton = this.$el.find(".js-save-form"), this.saveFormButton.attr("disabled", !0).text(c.options.dict.ALL_CHANGES_SAVED), setInterval(function() {
                return a.saveForm.call(a)
            }, 500), $(window).bind("beforeunload", function() {
                return a.formSaved ? void 0 : c.options.dict.UNSAVED_CHANGES
            })
        }, e.prototype.reset = function() {
            return this.$responseFields.html(""), this.addAll()
        }, e.prototype.render = function() {
            var a, b, d, e;
            for (this.$el.html(c.templates.page()), this.$fbLeft = this.$el.find(".fb-left"), this.$responseFields = this.$el.find(".fb-response-fields"), this.bindWindowScrollEvent(), this.hideShowNoResponseFields(), e = this.SUBVIEWS, b = 0, d = e.length; d > b; b++) a = e[b], new a({
                parentView: this
            }).render();
            return this
        }, e.prototype.bindWindowScrollEvent = function() {
            var a = this;
            return $(window).on("scroll", function() {
                var b, c;
                if (a.$fbLeft.data("locked") !== !0) return c = Math.max(0, $(window).scrollTop()), b = a.$responseFields.height(), a.$fbLeft.css({
                    "margin-top": Math.min(b, c)
                })
            })
        }, e.prototype.showTab = function(a) {
            var b, c, d;
            return b = $(a.currentTarget), d = b.data("target"), b.closest("li").addClass("active").siblings("li").removeClass("active"), $(d).addClass("active").siblings(".fb-tab-pane").removeClass("active"), "#editField" !== d && this.unlockLeftWrapper(), "#editField" === d && !this.editView && (c = this.collection.models[0]) ? this.createAndShowEditView(c) : void 0
        }, e.prototype.addOne = function(a, b, c) {
            var d, e;
            return e = new f({
                model: a,
                parentView: this
            }), null != c.$replaceEl ? c.$replaceEl.replaceWith(e.render().el) : null == c.position || -1 === c.position ? this.$responseFields.append(e.render().el) : 0 === c.position ? this.$responseFields.prepend(e.render().el) : (d = this.$responseFields.find(".fb-field-wrapper").eq(c.position))[0] ? d.before(e.render().el) : this.$responseFields.append(e.render().el)
        }, e.prototype.setSortable = function() {
            var a = this;
            return this.$responseFields.hasClass("ui-sortable") && this.$responseFields.sortable("destroy"), this.$responseFields.sortable({
                forcePlaceholderSize: !0,
                placeholder: "sortable-placeholder",
                stop: function(b, d) {
                    var e;
                    return d.item.data("field-type") && (e = a.collection.create(c.helpers.defaultFieldAttrs(d.item.data("field-type")), {
                        $replaceEl: d.item
                    }), a.createAndShowEditView(e)), a.handleFormUpdate(), !0
                },
                update: function(b, c) {
                    return c.item.data("field-type") ? void 0 : a.ensureEditViewScrolled()
                }
            }), this.setDraggable()
        }, e.prototype.setDraggable = function() {
            var a, b = this;
            return a = this.$el.find("[data-field-type]"), a.draggable({
                connectToSortable: this.$responseFields,
                helper: function() {
                    var a;
                    return a = $("<div class='response-field-draggable-helper' />"), a.css({
                        width: b.$responseFields.width(),
                        height: "80px"
                    }), a
                }
            })
        }, e.prototype.addAll = function() {
            return this.collection.each(this.addOne, this), this.setSortable()
        }, e.prototype.hideShowNoResponseFields = function() {
            return this.$el.find(".fb-no-response-fields")[this.collection.length > 0 ? "hide" : "show"]()
        }, e.prototype.addField = function(a) {
            var b;
            return b = $(a.currentTarget).data("field-type"), this.createField(c.helpers.defaultFieldAttrs(b))
        }, e.prototype.createField = function(a, b) {
            var c;
            return c = this.collection.create(a, b), this.createAndShowEditView(c), this.handleFormUpdate()
        }, e.prototype.createAndShowEditView = function(a) {
            var c, d, e;
            if (d = this.$el.find(".fb-field-wrapper").filter(function() {
                return $(this).data("cid") === a.cid
            }), d.addClass("editing").siblings(".fb-field-wrapper").removeClass("editing"), this.editView) {
                if (this.editView.model.cid === a.cid) return this.$el.find('.fb-tabs a[data-target="#editField"]').click(), this.scrollLeftWrapper(d, "undefined" != typeof e && null !== e && e), void 0;
                e = this.$fbLeft.css("padding-top"), this.editView.remove()
            }
            return this.editView = new b({
                model: a,
                parentView: this
            }), c = this.editView.render().$el, this.$el.find(".fb-edit-field-wrapper").html(c), this.$el.find('.fb-tabs a[data-target="#editField"]').click(), this.scrollLeftWrapper(d), this
        }, e.prototype.ensureEditViewScrolled = function() {
            return this.editView ? this.scrollLeftWrapper($(".fb-field-wrapper.editing")) : void 0
        }, e.prototype.scrollLeftWrapper = function(a) {
            var b = this;
            return this.unlockLeftWrapper(), a[0] ? $.scrollWindowTo(a.offset().top - this.$responseFields.offset().top, 200, function() {
                return b.lockLeftWrapper()
            }) : void 0
        }, e.prototype.lockLeftWrapper = function() {
            return this.$fbLeft.data("locked", !0)
        }, e.prototype.unlockLeftWrapper = function() {
            return this.$fbLeft.data("locked", !1)
        }, e.prototype.handleFormUpdate = function() {
            return this.updatingBatch ? void 0 : (this.formSaved = !1, this.saveFormButton.removeAttr("disabled").text(c.options.dict.SAVE_FORM))
        }, e.prototype.saveForm = function() {
            var a;
            if (!this.formSaved) return this.formSaved = !0, this.saveFormButton.attr("disabled", !0).text(c.options.dict.ALL_CHANGES_SAVED), this.collection.sort(), a = JSON.stringify({
                fields: this.collection.toJSON()
            }), c.options.HTTP_ENDPOINT && this.doAjaxSave(a), this.formBuilder.trigger("save", a)
        }, e.prototype.doAjaxSave = function(a) {
            var b = this;
            return $.ajax({
                url: c.options.HTTP_ENDPOINT,
                type: c.options.HTTP_METHOD,
                data: a,
                contentType: "application/json",
                success: function(a) {
                    var c, d, e, f;
                    for (b.updatingBatch = !0, d = 0, e = a.length; e > d; d++) c = a[d], null != (f = b.collection.get(c.cid)) && f.set({
                        id: c.id
                    }), b.collection.trigger("sync");
                    return b.updatingBatch = void 0
                }
            })
        }, e
    }(Backbone.View), c = function() {
        function b(b) {
            var c;
            null == b && (b = {}), _.extend(this, Backbone.Events), c = _.extend(b, {
                formBuilder: this
            }), this.mainView = new a(c)
        }
        return b.helpers = {
            defaultFieldAttrs: function(a) {
                var c, d;
                return c = {
                    label: "Untitled",
                    field_type: a,
                    required: !0,
                    field_options: {}
                }, ("function" == typeof(d = b.fields[a]).defaultAttributes ? d.defaultAttributes(c) : void 0) || c
            },
            simple_format: function(a) {
                return null != a ? a.replace(/\n/g, "<br />") : void 0
            }
        }, b.options = {
            BUTTON_CLASS: "btn btn-default",
            HTTP_ENDPOINT: "",
            HTTP_METHOD: "POST",
            mappings: {
                SIZE: "field_options.size",
                UNITS: "field_options.units",
                LABEL: "label",
                FIELD_TYPE: "field_type",
                REQUIRED: "required",
                ADMIN_ONLY: "admin_only",
                OPTIONS: "field_options.options",
                DESCRIPTION: "field_options.description",
                INCLUDE_OTHER: "field_options.include_other_option",
                INCLUDE_BLANK: "field_options.include_blank_option",
                INTEGER_ONLY: "field_options.integer_only",
                MIN: "field_options.min",
                MAX: "field_options.max",
                MINLENGTH: "field_options.minlength",
                MAXLENGTH: "field_options.maxlength",
                LENGTH_UNITS: "field_options.min_max_length_units"
            },
            dict: {
                ALL_CHANGES_SAVED: "All changes saved",
                SAVE_FORM: "Save form",
                UNSAVED_CHANGES: "You have unsaved changes. If you leave this page, you will lose those changes!"
            }
        }, b.fields = {}, b.inputFields = {}, b.nonInputFields = {}, b.registerField = function(a, c) {
            var d, e, f, g;
            for (g = ["view", "edit"], e = 0, f = g.length; f > e; e++) d = g[e], c[d] = _.template(c[d]);
            return c.field_type = a, b.fields[a] = c, "non_input" === c.type ? b.nonInputFields[a] = c : b.inputFields[a] = c
        }, b
    }(), window.Formbuilder = c, "undefined" != typeof module && null !== module ? module.exports = c : window.Formbuilder = c
}.call(this),
/*function() {
    Formbuilder.registerField("address", {
        order: 50,
        view: "<div class='input-line'>\n  <span class='street'>\n    <input type='text' />\n    <label>Address</label>\n  </span>\n</div>\n\n<div class='input-line'>\n  <span class='city'>\n    <input type='text' />\n    <label>City</label>\n  </span>\n\n  <span class='state'>\n    <input type='text' />\n    <label>State / Province / Region</label>\n  </span>\n</div>\n\n<div class='input-line'>\n  <span class='zip'>\n    <input type='text' />\n    <label>Zipcode</label>\n  </span>\n\n  <span class='country'>\n    <select><option>United States</option></select>\n    <label>Country</label>\n  </span>\n</div>",
        edit: "",
        addButton: '<span class="symbol"><span class="fa fa-home"></span></span> Address'
    })
}.call(this),*/
function() {
    Formbuilder.registerField("checkboxes", {
        order: 10,
        view: "<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div>\n    <label class='fb-option'>\n      <input type='checkbox' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input type='checkbox' />\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
        edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
        addButton: '<span class="symbol"><span class="fa fa-square-o"></span></span> Checkboxes',
        defaultAttributes: function(a) {
            return a.field_options.options = [{
                label: "Option 1",
                checked: !1
            }, {
                label: "Options 2",
                checked: !1
            }], a
        }
    })
}.call(this),
function() {
    Formbuilder.registerField("date", {
        order: 20,
        view: "<div class='input-line'>\n  <span class='month'>\n    <input type=\"text\" />\n    <label>MM</label>\n  </span>\n\n  <span class='above-line'>/</span>\n\n  <span class='day'>\n    <input type=\"text\" />\n    <label>DD</label>\n  </span>\n\n  <span class='above-line'>/</span>\n\n  <span class='year'>\n    <input type=\"text\" />\n    <label>YYYY</label>\n  </span>\n</div>",
        edit: "",
        addButton: '<span class="symbol"><span class="fa fa-calendar"></span></span> Date'
    })
}.call(this),
function() {
    Formbuilder.registerField("dropdown", {
        order: 24,
        view: "<select>\n  <% if (rf.get(Formbuilder.options.mappings.INCLUDE_BLANK)) { %>\n    <option value=''></option>\n  <% } %>\n\n  <% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n    <option <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'selected' %>>\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </option>\n  <% } %>\n</select>",
        edit: "<%= Formbuilder.templates['edit/options']({ includeBlank: true }) %>",
        addButton: '<span class="symbol"><span class="fa fa-caret-down"></span></span> Dropdown',
        defaultAttributes: function(a) {
            return a.field_options.options = [{
                label: "",
                checked: !1
            }, {
                label: "",
                checked: !1
            }], a.field_options.include_blank_option = !1, a
        }
    })
}.call(this),
function() {
    Formbuilder.registerField("email", {
        order: 40,
        view: "<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",
        edit: "<%= Formbuilder.templates['edit/size']() %>",
        addButton: '<span class="symbol"><span class="fa fa-envelope-o"></span></span> Email',
        defaultAttributes: function(a) {
            return a.field_options.size = "large", a
        }
    })
}.call(this), /*function(){Formbuilder.registerField("file",{order:55,view:"<input type='file' />",edit:"",addButton:'<span class="symbol"><span class="fa fa-cloud-upload"></span></span> File'})}.call(this),*/
function() {
    Formbuilder.registerField("number", {
        order: 30,
        view: "<input type='text' />\n<% if (units = rf.get(Formbuilder.options.mappings.UNITS)) { %>\n  <%= units %>\n<% } %>",
        edit: "<%= Formbuilder.templates['edit/min_max']() %>\n<%= Formbuilder.templates['edit/units']() %>\n<%= Formbuilder.templates['edit/integer_only']() %>",
        addButton: '<span class="symbol"><span class="fa fa-number">123</span></span> Number'
    })
}.call(this),
function() {
    Formbuilder.registerField("paragraph", {
        order: 5,
        view: "<textarea class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>'></textarea>",
        edit: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",
        addButton: '<span class="symbol">&#182;</span> Paragraph',
        defaultAttributes: function(a) {
            return a.field_options.size = "large", a
        }
    })
}.call(this), /*function(){Formbuilder.registerField("price",{order:45,view:"<div class='input-line'>\n  <span class='above-line'>$</span>\n  <span class='dolars'>\n    <input type='text' />\n    <label>Dollars</label>\n  </span>\n  <span class='above-line'>.</span>\n  <span class='cents'>\n    <input type='text' />\n    <label>Cents</label>\n  </span>\n</div>",edit:"",addButton:'<span class="symbol"><span class="fa fa-usd"></span></span> Price'})}.call(this),*/
function() {
    Formbuilder.registerField("radio", {
        order: 15,
        view: "<% for (i in (rf.get(Formbuilder.options.mappings.OPTIONS) || [])) { %>\n  <div>\n    <label class='fb-option'>\n      <input type='radio' <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].checked && 'checked' %> onclick=\"javascript: return false;\" />\n      <%= rf.get(Formbuilder.options.mappings.OPTIONS)[i].label %>\n    </label>\n  </div>\n<% } %>\n\n<% if (rf.get(Formbuilder.options.mappings.INCLUDE_OTHER)) { %>\n  <div class='other-option'>\n    <label class='fb-option'>\n      <input type='radio' />\n      Other\n    </label>\n\n    <input type='text' />\n  </div>\n<% } %>",
        edit: "<%= Formbuilder.templates['edit/options']({ includeOther: true }) %>",
        addButton: '<span class="symbol"><span class="fa fa-circle-o"></span></span> Multiple Choice',
        defaultAttributes: function(a) {
            return a.field_options.options = [{
                label: "Option 1",
                checked: !1
            }, {
                label: "Option 2",
                checked: !1
            }], a
        }
    })
}.call(this),
function() {
    Formbuilder.registerField("section_break", {
        order: 0,
        type: "non_input",
        view: "<label class='section-name'><%= rf.get(Formbuilder.options.mappings.LABEL) %></label>\n<p><%= rf.get(Formbuilder.options.mappings.DESCRIPTION) %></p>",
        edit: "<div class='fb-edit-section-header'>Label</div>\n<input type='text' data-rv-input='model.<%= Formbuilder.options.mappings.LABEL %>' />\n<textarea data-rv-input='model.<%= Formbuilder.options.mappings.DESCRIPTION %>'\n  placeholder='Add a longer description to this field'></textarea>",
        addButton: "<span class='symbol'><span class='fa fa-minus'></span></span> Section Break"
    })
}.call(this),
function() {
    Formbuilder.registerField("text", {
        order: 0,
        view: "<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' />",
        edit: "<%= Formbuilder.templates['edit/size']() %>\n<%= Formbuilder.templates['edit/min_max_length']() %>",
        addButton: "<span class='symbol'><span class='fa fa-font'></span></span> Text",
        defaultAttributes: function(a) {
            return a.field_options.size = "large", a
        }
    })
}.call(this),
function() {
    Formbuilder.registerField("time", {
        order: 25,
        view: "<div class='input-line'>\n  <span class='hours'>\n    <input type=\"text\" />\n    <label>HH</label>\n  </span>\n\n  <span class='above-line'>:</span>\n\n  <span class='minutes'>\n    <input type=\"text\" />\n    <label>MM</label>\n  </span>\n\n  <span class='above-line'>:</span>\n\n  <span class='seconds'>\n    <input type=\"text\" />\n    <label>SS</label>\n  </span>\n\n  <span class='am_pm'>\n    <select>\n      <option>AM</option>\n      <option>PM</option>\n    </select>\n  </span>\n</div>",
        edit: "",
        addButton: '<span class="symbol"><span class="fa fa-clock-o"></span></span> Time'
    })
}.call(this),
function() {
    Formbuilder.registerField("website", {
        order: 35,
        view: "<input type='text' class='rf-size-<%= rf.get(Formbuilder.options.mappings.SIZE) %>' placeholder='http://' />",
        edit: "<%= Formbuilder.templates['edit/size']() %>",
        addButton: '<span class="symbol"><span class="fa fa-link"></span></span> Website',
        defaultAttributes: function(a) {
            return a.field_options.size = "large", a
        }
    })
}.call(this), this.Formbuilder = this.Formbuilder || {}, this.Formbuilder.templates = this.Formbuilder.templates || {}, this.Formbuilder.templates["edit/base"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    var rf = obj.rf;

    __p += (null == (__t = Formbuilder.templates["edit/base_header"]()) ? "" : __t) + "\n" + (null == (__t = Formbuilder.templates["edit/common"]()) ? "" : __t) + "\n" + (null == (__t = Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({
        rf: rf
    })) ? "" : __t) + "\n";
    return __p
}, this.Formbuilder.templates["edit/base_header"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += "<div class='fb-field-label'>\n  <span data-rv-text=\"model." + (null == (__t = Formbuilder.options.mappings.LABEL) ? "" : __t) + "\"></span>\n  <code class='field-type' data-rv-text='model." + (null == (__t = Formbuilder.options.mappings.FIELD_TYPE) ? "" : __t) + "'></code>\n  <span class='fa fa-arrow-right pull-right'></span>\n</div>";
    return __p
}, this.Formbuilder.templates["edit/base_non_input"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    var rf = obj.rf;
    __p += (null == (__t = Formbuilder.templates["edit/base_header"]()) ? "" : __t) + "\n" + (null == (__t = Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].edit({
        rf: rf
    })) ? "" : __t) + "\n";
    return __p
}, this.Formbuilder.templates["edit/checkboxes"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    var rf=obj.rf;

    __p += "<label>\n  <input type='checkbox' data-rv-checked='model." + (null == (__t = Formbuilder.options.mappings.REQUIRED) ? "" : __t) + "' />\n  Required\n</label>\n<label>";
    return __p
}, this.Formbuilder.templates["edit/common"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += "<div class='fb-edit-section-header'>Label</div>\n\n<div class='fb-common-wrapper'>\n  <div class='fb-label-description'>\n    " + (null == (__t = Formbuilder.templates["edit/label_description"]()) ? "" : __t) + "\n  </div>\n  <div class='fb-common-checkboxes'>\n    " + (null == (__t = Formbuilder.templates["edit/checkboxes"]()) ? "" : __t) + "\n  </div>\n  <div class='fb-clear'></td></tr></table></div>\n</div>\n";
    return __p
}, this.Formbuilder.templates["edit/integer_only"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += "<div class='fb-edit-section-header'>Integer only</div>\n<label>\n  <input type='checkbox' data-rv-checked='model." + (null == (__t = Formbuilder.options.mappings.INTEGER_ONLY) ? "" : __t) + "' />\n  Only accept integers\n</label>\n";
    return __p
}, this.Formbuilder.templates["edit/label_description"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += "<input type='text' data-rv-input='model." + (null == (__t = Formbuilder.options.mappings.LABEL) ? "" : __t) + "' />\n<textarea data-rv-input='model." + (null == (__t = Formbuilder.options.mappings.DESCRIPTION) ? "" : __t) + "'\n  placeholder='Add a longer description to this field'></textarea>";
    return __p
}, this.Formbuilder.templates["edit/min_max"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += '<div class=\'fb-edit-section-header\'>Minimum / Maximum</div>\n\nAbove\n<input type="text" data-rv-input="model.' + (null == (__t = Formbuilder.options.mappings.MIN) ? "" : __t) + '" style="width: 60px" />\n\n&nbsp;&nbsp;\n\nBelow\n<input type="text" data-rv-input="model.' + (null == (__t = Formbuilder.options.mappings.MAX) ? "" : __t) + '" style="width: 60px" />\n';
    return __p
}, this.Formbuilder.templates["edit/min_max_length"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += '<div class=\'fb-edit-section-header\'>Length Limit</div>\n\nMin\n<input type="text" data-rv-input="model.' + (null == (__t = Formbuilder.options.mappings.MINLENGTH) ? "" : __t) + '" style="width: 60px" />\n\n&nbsp;&nbsp;\n\nMax\n<input type="text" data-rv-input="model.' + (null == (__t = Formbuilder.options.mappings.MAXLENGTH) ? "" : __t) + '" style="width: 60px" />\n\n&nbsp;&nbsp;\n\n<select data-rv-value="model.' + (null == (__t = Formbuilder.options.mappings.LENGTH_UNITS) ? "" : __t) + '" style="width: auto;">\n  <option value="characters">characters</option>\n  <option value="words">words</option>\n</select>\n';
    return __p
}, this.Formbuilder.templates["edit/options"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape, Array.prototype.join
    }
    __p += "<div class='fb-edit-section-header'>Options</div>\n\n", "undefined" != typeof includeBlank && (__p += "\n  <label>\n    <input type='checkbox' data-rv-checked='model." + (null == (__t = Formbuilder.options.mappings.INCLUDE_BLANK) ? "" : __t) + "' />\n    Include blank\n  </label>\n"), __p += "\n\n<div class='option' data-rv-each-option='model." + (null == (__t = Formbuilder.options.mappings.OPTIONS) ? "" : __t) + '\'>\n  <input type="checkbox" class=\'js-default-updated\' data-rv-checked="option:checked" />\n  <input type="text" data-rv-input="option:label" class=\'option-label-input\' />\n  <a class="js-add-option ' + (null == (__t = Formbuilder.options.BUTTON_CLASS) ? "" : __t) + '" title="Add Option"><i class=\'fa fa-plus-circle\'></i></a>\n  <a class="js-remove-option ' + (null == (__t = Formbuilder.options.BUTTON_CLASS) ? "" : __t) + '" title="Remove Option"><i class=\'fa fa-minus-circle\'></i></a>\n</div>\n\n', "undefined" != typeof includeOther && (__p += "\n  <label>\n    <input type='checkbox' data-rv-checked='model." + (null == (__t = Formbuilder.options.mappings.INCLUDE_OTHER) ? "" : __t) + '\' />\n    Include "other"\n  </label>\n'), __p += "\n\n<div class='fb-bottom-add'>\n  <a class=\"js-add-option " + (null == (__t = Formbuilder.options.BUTTON_CLASS) ? "" : __t) + '">Add option</a>\n</div>\n';
    return __p
}, this.Formbuilder.templates["edit/size"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += "<div class='fb-edit-section-header'>Size</div>\n<select data-rv-value=\"model." + (null == (__t = Formbuilder.options.mappings.SIZE) ? "" : __t) + '">\n  <option value="small">Small</option>\n  <option value="medium">Medium</option>\n  <option value="large">Large</option>\n</select>\n';
    return __p
}, this.Formbuilder.templates["edit/units"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += '<div class=\'fb-edit-section-header\'>Units</div>\n<input type="text" data-rv-input="model.' + (null == (__t = Formbuilder.options.mappings.UNITS) ? "" : __t) + '" />\n';
    return __p
}, this.Formbuilder.templates.page = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += (null == (__t = Formbuilder.templates["partials/save_button"]()) ? "" : __t) + "\n" + (null == (__t = Formbuilder.templates["partials/left_side"]()) ? "" : __t) + "\n" + (null == (__t = Formbuilder.templates["partials/right_side"]()) ? "" : __t) + "\n<div class='fb-clear'></div>";
    return __p
}, this.Formbuilder.templates["partials/add_field"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape, Array.prototype.join
    }
    __p += "<div class='fb-tab-pane active' id='addField'>\n  <div class='fb-add-field-types'>\n    <div class='section'>\n      ", _.each(_.sortBy(Formbuilder.inputFields, "order"), function(a) {
        __p += '\n        <a data-field-type="' + (null == (__t = a.field_type) ? "" : __t) + '" class="' + (null == (__t = Formbuilder.options.BUTTON_CLASS) ? "" : __t) + '">\n          ' + (null == (__t = a.addButton) ? "" : __t) + "\n        </a>\n      "
    }), __p += "\n    </div>\n\n    <div class='section'>\n      ", _.each(_.sortBy(Formbuilder.nonInputFields, "order"), function(a) {
        __p += '\n        <a data-field-type="' + (null == (__t = a.field_type) ? "" : __t) + '" class="' + (null == (__t = Formbuilder.options.BUTTON_CLASS) ? "" : __t) + '">\n          ' + (null == (__t = a.addButton) ? "" : __t) + "\n        </a>\n      "
    }), __p += "\n    </div>\n  </div>\n</div>";
    return __p
}, this.Formbuilder.templates["partials/edit_field"] = function(obj) {
    obj || (obj = {}); {
        var __p = "";
        _.escape
    }
    __p += "<div class='fb-tab-pane' id='editField'>\n  <div class='fb-edit-field-wrapper'></div>\n</div>\n";
    return __p
}, this.Formbuilder.templates["partials/left_side"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += "<table><tr><td class='fb-left-td'><div class='fb-left'>\n  <ul class='fb-tabs'>\n    <li class='active'><a data-target='#addField'><i class='fa fa-plus' /> &nbsp;Add new field</a></li>\n    <li><a data-target='#editField'><i class='fa fa-pencil' /> &nbsp;Edit field</a></li>\n  </ul>\n\n  <div class='fb-tab-content'>\n    " + (null == (__t = Formbuilder.templates["partials/add_field"]()) ? "" : __t) + "\n    " + (null == (__t = Formbuilder.templates["partials/edit_field"]()) ? "" : __t) + "\n  </div>\n</div>";
    return __p
}, this.Formbuilder.templates["partials/right_side"] = function(obj) {
    obj || (obj = {}); {
        var __p = "";
        _.escape
    }
    __p += "</td><td class='fb-right-td'><div class='fb-right'>\n  <div class='fb-no-response-fields'>There are no fields yet, drag them here from the left panel to add them.</div>\n  <div class='fb-response-fields'></div>\n</div>\n";
    return __p
}, this.Formbuilder.templates["partials/save_button"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += "<div class='fb-save-wrapper'>\n  <button class='js-save-form " + (null == (__t = Formbuilder.options.BUTTON_CLASS) ? "" : __t) + "'></button>\n</div>";
    return __p
}, this.Formbuilder.templates["view/base"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    var rf = obj.rf;

    __p += "<div class='subtemplate-wrapper'>\n  <div class='cover'></div>\n  " + (null == (__t = Formbuilder.templates["view/label"]({
        rf: rf
    })) ? "" : __t) + "\n\n  " + (null == (__t = Formbuilder.templates["view/description"]({
        rf: rf
    })) ? "" : __t) + "\n\n  " + (null == (__t = Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({
        rf: rf
    })) ? "" : __t) + "\n  " + (null == (__t = Formbuilder.templates["view/duplicate_remove"]({
        rf: rf
    })) ? "" : __t) + "\n</div>\n";
    return __p
}, this.Formbuilder.templates["view/base_non_input"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    var rf = obj.rf;

    __p += "<div class='subtemplate-wrapper'>\n  <div class='cover'></div>\n  " + (null == (__t = Formbuilder.fields[rf.get(Formbuilder.options.mappings.FIELD_TYPE)].view({
        rf: rf
    })) ? "" : __t) + "\n  " + (null == (__t = Formbuilder.templates["view/duplicate_remove"]({
        rf: rf
    })) ? "" : __t) + "\n</div>\n";
    return __p
}, this.Formbuilder.templates["view/description"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    var rf = obj.rf;
    __p += "<span class='help-block'>\n  " + (null == (__t = Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.DESCRIPTION))) ? "" : __t) + "\n</span>\n";
    return __p
}, this.Formbuilder.templates["view/duplicate_remove"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape
    }
    __p += "<div class='actions-wrapper'>\n  <a class=\"js-duplicate " + (null == (__t = Formbuilder.options.BUTTON_CLASS) ? "" : __t) + '" title="Duplicate Field"><i class=\'fa fa-plus-circle\'></i></a>\n  <a class="js-clear ' + (null == (__t = Formbuilder.options.BUTTON_CLASS) ? "" : __t) + '" title="Remove Field"><i class=\'fa fa-minus-circle\'></i></a>\n</div>';
    return __p
}, this.Formbuilder.templates["view/label"] = function(obj) {
    obj || (obj = {}); {
        var __t, __p = "";
        _.escape, Array.prototype.join
    }
    var rf = obj.rf;

    __p += "<label>\n  <span>" + (null == (__t = Formbuilder.helpers.simple_format(rf.get(Formbuilder.options.mappings.LABEL))) ? "" : __t) + "\n  ", rf.get(Formbuilder.options.mappings.REQUIRED) && (__p += "\n    <abbr title='required'>*</abbr>\n  "), __p += "\n</label>\n";
    return __p
};
