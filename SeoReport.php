<?php
function isAlive($url) {
    set_time_limit(0);
    $ch = curl_init();
    curl_setopt($ch, CURLOPT_URL, $url);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);
    curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, FALSE);
    curl_setopt($ch, CURLOPT_TIMEOUT, 60);
    curl_setopt($ch, CURLOPT_DNS_USE_GLOBAL_CACHE, false);
    curl_setopt($ch, CURLOPT_DNS_CACHE_TIMEOUT, 2);
    curl_exec ($ch);
    $int_return_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close ($ch);

    $validCodes = [200, 301, 302, 304];

    if (in_array($int_return_code, $validCodes)) {
        return ['HTTP_CODE' => $int_return_code, 'STATUS' => true];
    } else {
        return ['HTTP_CODE' => $int_return_code, 'STATUS' => false];
    }
}

/**
 * This method need to call from your source class file to generate SEO Report
 */
function getSeoReport($url) {
    $htmlInfo = [];

	$isAlive = isAlive($url);

	if ($isAlive['STATUS'] == true) {
		$htmlInfo['isAlive'] = true;
	} else {
		$htmlInfo['isAlive'] = false;
    }
    
	$htmlInfo['url'] = $url;
	$reqHTML = getReadyHTML($htmlInfo);

	return $reqHTML;
}

function getReadyHTML($htmlInfo) {
    $html = '';

    $html .= '<div class="seo-audit-wrapper">';
        if ($htmlInfo['isAlive'] === true) {
            $html .= '<h1 id="report-icon"><i class="far fa-fw fa-check-circle"></i> Site Report for ' . $htmlInfo['url'] . '</h1>';

            $html .= '<div class="progress-bar">
                            <svg viewBox="-1 -1 34 34" xmlns="http://www.w3.org/2000/svg">
                                <circle class="progress-bar__background" cx="16" cy="16" r="15.9155"></circle>
                                <circle id="performance_score" class="progress-bar__progress" cx="16" cy="16" r="15.9155"></circle>
                            </svg>
                            <div class="progress-text" id="performance">
                                <span><i class="fas fa-spin fa-cog"></i></span><span style="font-size: 14px; font-weight: 400; display: block;">Performance</span>
                            </div>
                        </div>'; 

            $html .= '<div class="progress-bar">
                            <svg viewBox="-1 -1 34 34" xmlns="http://www.w3.org/2000/svg">
                                <circle class="progress-bar__background" cx="16" cy="16" r="15.9155"></circle>
                                <circle id="accessibility_score" class="progress-bar__progress" cx="16" cy="16" r="15.9155" style="stroke: red;"></circle>
                            </svg>
                            <div class="progress-text" id="accessibility">
                                <span><i class="fas fa-spin fa-cog"></i></span><span style="font-size: 14px; font-weight: 400; display: block;">Accessibility</span>
                            </div>
                        </div>';

            $html .= '<div class="progress-bar">
                            <svg viewBox="-1 -1 34 34" xmlns="http://www.w3.org/2000/svg">
                                <circle class="progress-bar__background" cx="16" cy="16" r="15.9155"></circle>
                                <circle id="best_practices_score" class="progress-bar__progress" cx="16" cy="16" r="15.9155" style="stroke: #008000;"></circle>
                            </svg>
                            <div class="progress-text" id="best_practices">
                                <span><i class="fas fa-spin fa-cog"></i></span><span style="font-size: 14px; font-weight: 400; display: block;">Best Practices</span>
                            </div>
                        </div>';

            $html .= '<div class="progress-bar">
                            <svg viewBox="-1 -1 34 34" xmlns="http://www.w3.org/2000/svg">
                                <circle class="progress-bar__background" cx="16" cy="16" r="15.9155"></circle>
                                <circle id="pwa_score" class="progress-bar__progress" cx="16" cy="16" r="15.9155" style="stroke: #FD95B4;"></circle>
                            </svg>
                            <div class="progress-text" id="pwa">
                                <span><i class="fas fa-spin fa-cog"></i></span><span style="font-size: 14px; font-weight: 400; display: block;">PWA</span>
                            </div>
                        </div>';

            $html .= '<div class="progress-bar">
                            <svg viewBox="-1 -1 34 34" xmlns="http://www.w3.org/2000/svg">
                                <circle class="progress-bar__background" cx="16" cy="16" r="15.9155"></circle>
                                <circle id="seo_score" class="progress-bar__progress" cx="16" cy="16" r="15.9155" style="stroke: #FD95B4;"></circle>
                            </svg>
                            <div class="progress-text" id="seo">
                                <span><i class="fas fa-spin fa-cog"></i></span><span style="font-size: 14px; font-weight: 400; display: block;">SEO</span>
                            </div>
                        </div>';

            $html .= '<div id="scores">
                <div id="first-contentful-paint">First Contentful Paint <span><i class="fas fa-spin fa-cog"></i></span></div>
                <div id="speed-index">Speed Index <span><i class="fas fa-spin fa-cog"></i></span></div>
                <div id="time-to-interactive">Time to Interactive <span><i class="fas fa-spin fa-cog"></i></span></div>
                <div id="first-meaningful-paint">First Meaningful Paint <span><i class="fas fa-spin fa-cog"></i></span></div>
                <div id="first-cpu-idle">First CPU Idle <span><i class="fas fa-spin fa-cog"></i></span></div>
                <div id="estimated-input-latency">Estimated Input Latency <span><i class="fas fa-spin fa-cog"></i></span></div>
            </div>';

            $html .= '<h2>Opportunities</h2>
            <p id="opportunities"></p>';

		} else {
			$html .= '<h2 class="is-bad">Your site could not be loaded.</h2><h3>Check that the url is in correct form </h3>';
		}
	$html .= '</div>';

	return $html;
}


$url = $_GET['url'];
$ch = curl_init($url);
curl_setopt($ch, CURLOPT_HEADER, false);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_BINARYTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
curl_setopt($ch, CURLOPT_TIMEOUT, 60);
curl_exec($ch);
$redirectURL = curl_getinfo($ch,CURLINFO_EFFECTIVE_URL ); // If url is redirected
curl_close($ch);
echo getSeoReport($redirectURL);
