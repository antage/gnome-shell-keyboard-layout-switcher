/* extension.js
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 *
 * SPDX-License-Identifier: GPL-2.0-or-later
 */

/* exported init */

const DEBUG = false;

const Meta = imports.gi.Meta;
const Shell = imports.gi.Shell;
const Main = imports.ui.main;
const Keyboard = imports.ui.status.keyboard;

const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

class Extension {
    constructor() {
		if (DEBUG)
			log('constructor()');
		this._key_handler_id = null;
		this._layout1_action = null;
		this._layout1_name = null;
		this._layout2_action = null;
		this._layout2_name = null;
    }

    enable() {
		if (DEBUG)
			log('enable()');
		try {
			this._key_handler_id =
				global.display.connect(
					'accelerator-activated',
					this._handler.bind(this)
				);

			this._layout1_action = global.display.grab_accelerator('Hyper_L', 0);
			if (this.layout1_action == Meta.KeyBindingAction.NONE) {
				if (DEBUG)
					log('Unable to grab Hyper_L accelerator');
			} else {
				let action = this._layout1_action;
				if (DEBUG)
					log('Grabbed Hyper_L accelerator [action={}]', action);
				this._layout1_name = Meta.external_binding_name_for_action(action);
				let name = this._layout1_name;
				if (DEBUG)
					log('Received binding name for action [name={}, action={}]', name, action);

				if (DEBUG)
					log('Requesting WM to allow binding [name={}]', name);
				Main.wm.allowKeybinding(name, Shell.ActionMode.ALL);
			}
			this._layout2_action = global.display.grab_accelerator('<Shift>Hyper_L', 0);
			if (this.layout2_action == Meta.KeyBindingAction.NONE) {
				if (DEBUG)
					log('Unable to grab <Shift>Hyper_L accelerator');
			} else {
				let action = this._layout2_action;
				if (DEBUG)
					log('Grabbed <Shift>Hyper_L accelerator [action={}]', action);
				this._layout2_name = Meta.external_binding_name_for_action(action);
				let name = this._layout2_name;
				if (DEBUG)
					log('Received binding name for action [name={}, action={}]', name, action);

				if (DEBUG)
					log('Requesting WM to allow binding [name={}]', name);
				Main.wm.allowKeybinding(name, Shell.ActionMode.ALL);
			}
		} catch (e) {
			logError(e, 'enable() error: ');
		}
    }

    disable() {
		if (DEBUG)
			log('disable()');
		try {
			if (this._layout1_action) {
				if (global.display.ungrab_accelerator(this._layout1_action)) {
					if (DEBUG)
						log('Ungrab Hyper_L accelerator');
					this._layout1_action = null;
				}
			}
			if (this._layout1_name) {
				Main.wm.allowKeybinding(this._layout1_name, Shell.ActionMode.NONE);
				if (DEBUG)
					log('Release Hyper_L keybinding.');
				this._layout1_name = null;
			}
			if (this._layout2_action) {
				if (global.display.ungrab_accelerator(this._layout2_action)) {
					if (DEBUG)
						log('Ungrab <Shift>Hyper_L accelerator');
					this._layout2_action = null;
				}
			}
			if (this._layout2_name) {
				Main.wm.allowKeybinding(this._layout2_name, Shell.ActionMode.NONE);
				if (DEBUG)
					log('Release <Shift>Hyper_L keybinding.');
				this._layout2_name = null;
			}
			if (this._key_handler_id) {
				global.display.disconnect(this._key_handler_id);
				this._key_handler_id = null;
			}
		} catch (e) {
			logError(e, 'disable() error: ');
		}
    }

	_handler(_, action) {
		if (DEBUG)
			log('handler [action={}]', action);
		if (action == this._layout1_action) {
			if (DEBUG)
				log('switch to layout #1');
			try {
				Keyboard.getInputSourceManager().inputSources[0].activate();
			} catch (e) {
				logError(e, '_handler() error: ');
			}
		}
		if (action == this._layout2_action) {
			if (DEBUG)
				log('switch to layout #2');
			try {
				Keyboard.getInputSourceManager().inputSources[1].activate();
			} catch (e) {
				logError(e, '_handler() error: ');
			}
		}
	}
}

function init() {
    return new Extension();
}
