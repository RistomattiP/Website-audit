<?php
/**
 * Plugin Name: Website Audit
 * Description: WordPress Plugin for analyzing given webiste
 * Version: 1.0.0
 * Author: RistomattiP
 * License: GNU General Public License v3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.html
 */

function wp_audit_show_form() {
    $out = '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Google+Sans:400,700&display=swap">
 <style>
 code.small {
     font-family: SFMono-Regular, Consolas, Liberation Mono, Menlo, monospace;
     font-size: 12px;
     color: #0366d6;
 }

 .seo-form-wrapper,
 .seo-audit-wrapper {
     font-family: "Google Sans";
     font-size: 16px;
     line-height: 1.5;

     width: 960px;
     margin: 0 auto;
     word-wrap: break-word;
 }
 .seo-form-wrapper input[type="url"] {
     font-family: inherit;
     font-size: inherit;
     border: 1px solid #bdc3c7;
     padding: 8px;
     border-radius: 3px;
     width: 100%;
 }
 .seo-form-wrapper input[type="email"] {
     font-family: inherit;
     font-size: inherit;
     border: 1px solid #bdc3c7;
     padding: 6px;
     border-radius: 3px;
     width: 50%;
 }
 .seo-form-wrapper input[type="submit"] {
     font-family: inherit;
     font-size: 18px;
     font-weight: 400;
     background-color: #1abc9c;
     color: #ffffff;
     display: inline-block;
     padding: 16px 24px;
     border: 0 none;
     border-radius: 3px;
     cursor: pointer;
 }
 .seo-form-wrapper input[type="submit"]:hover {
     background-color: #16a085;
 }
 .seo-audit-snippet {
     width: 720px;
     margin: 24px;
 }

 .is-good {
     color: #18b663;
 }
 .is-bad {
     color: #fb8c00;
 }
 .is-ugly {
     color: #e53935;
 }

 #scores {
    display: flex;
    flex-wrap: wrap;
  }
  
  #scores div {
    flex-basis: 31%;
    margin: 1px;
    margin-right: 10px;
    min-width: 260px;
    max-width: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 40px;
    border: 1px solid #e8eaed;
    color: black;
  }

 .progress-bar {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 150px;
}
.progress-bar svg {
    transform: rotate(-90deg);
    width: 150px;
}
.progress-bar .progress-bar__background {
    fill: none;
    stroke: #666666;
    stroke-width: 0.1;
}
.progress-bar .progress-bar__progress {
    fill: none;
    stroke: #72C8B7;
    stroke-dasharray: 100 100;
    stroke-dashoffset: 100;
    stroke-linecap: round;
    transition: stroke-dashoffset 1s ease-in-out;
}
.progress-bar .progress-text {
    font-family: Montserrat;
    font-size: 38px;
    font-weight: 700;
    text-align: center;
    position: absolute;
}
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #ccc;
  -webkit-transition: .4s;
  transition: .4s;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  -webkit-transition: .4s;
  transition: .4s;
}

input:checked + .slider {
    background-color: #1abc9c;
}
  
  input:focus + .slider {
    box-shadow: 0 0 1px #1abc9c;
}

input:checked + .slider:before {
  -webkit-transform: translateX(26px);
  -ms-transform: translateX(26px);
  transform: translateX(26px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 34px;
}

.slider.round:before {
  border-radius: 50%;
}

 </style>

 <div class="seo-form-wrapper">
     <form method="post">
         <p>
             <label for="init-lighthouse-url">Site URL</label>
             <br><input type="url" name="url" id="init-lighthouse-url" autocomplete="off">
             <br><small>e.g. https://www.example.com/</small>
         </p>
         <p>
            <label>Strategy desktop</label>
            <br>
            <label class="switch">
            <input type="checkbox" id="init-lighthouse-checkbox">
            <span class="slider round"></span>
            </label>
            <br><small>Default is mobile.</small>
         </p>
         <p>
             <input type="submit" value="Run Audit" id="init-lighthouse">
         </p>
     </form>
 </div>

 <div id="seo-audit"></div>';

return $out;
}

add_shortcode('audit', 'wp_audit_show_form');


function wp_audit_enqueue_scripts() {
    wp_enqueue_script('fa5', 'https://use.fontawesome.com/releases/v5.10.0/js/all.js', [], '5.10.0', true);
    wp_enqueue_script('wp-audit-lighthouse', plugins_url('/js/lighthouse.js', __FILE__), [], '1.0.0', true);

    wp_localize_script('wp-audit-lighthouse', 'wpAuditAjaxVar', [
        'ajaxurl' => admin_url('admin-ajax.php'),
        'seoreporturl' => plugins_url('/SeoReport.php', __FILE__)
    ]);
}
add_action('wp_enqueue_scripts', 'wp_audit_enqueue_scripts');
