document.addEventListener('DOMContentLoaded', function () {
    if (document.getElementById('init-lighthouse')) {
        document.getElementById('init-lighthouse').addEventListener('click', function (event) {
            event.preventDefault();

            document.getElementById('seo-audit').innerHTML = '<div class="progress-bar">'+
            '<svg viewBox="-1 -1 34 34" xmlns="http://www.w3.org/2000/svg">'+
            '</svg><div class="progress-text"><span><i class="fas fa-spin fa-cog"></i></span>'+
            '<span style="font-size: 14px; font-weight: 400; display: block;"></span></div></div>';

            var request = new XMLHttpRequest(),
                siteUrl = wpAuditAjaxVar.seoreporturl + '?url=' + document.getElementById('init-lighthouse-url').value,
                auditUrl = document.getElementById('init-lighthouse-url').value
                encodedUrl = encodeURIComponent(auditUrl);

            // Adds url scheme to start of the url www.example.com -> http://www.example.com
            if (encodedUrl.includes('http') == false)  {
                encodedUrl = 'http://' + encodedUrl;
            }
            
            request.open('GET', siteUrl, true);
            request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
            request.onload = function (response) {
                if (this.status >= 200 && this.status < 400) {
                    document.getElementById('seo-audit').innerHTML = this.response;

                    Array.from(document.querySelectorAll('.progress')).forEach(function(element) {
                    	var options = {};
                    	['progress', 'roundStroke', 'zeroTick', 'label'].forEach(function (item) {
                    		if (element.dataset[item]) {
                    			options[item] = element.dataset[item]
                    			if (options[item] === 'true') options[item] = true
                    			if (options[item] === 'false') options[item] = false
                    		}
                    	})
                    	var progress = new Progress(element, options)
                    })
                } else {
                    // Response error

                }
            };
            request.onerror = function () {
                // Connection error
            };
            request.send('url=' + siteUrl);
            

            var categories = ['accessibility', 'best-practices', 'performance', 'pwa', 'seo' ];

            /**
             * Check if checkbox was checked
             * @return {string} Return string for API call strategy query parameters
             */
            function lighthouse_strategy() {
                if (document.querySelector("#init-lighthouse-checkbox").checked) {
                    return 'desktop';
                } else {
                    return 'mobile';
                }
            }

            fetch(`https://www.googleapis.com/pagespeedonline/v5/runPagespeed?screenshot=true&strategy=${lighthouse_strategy()}&url=${encodedUrl}&category=${categories[0]}&category=${categories[1]}&category=${categories[2]}&category=${categories[3]}&category=${categories[4]}`)
              .then(function(response) {
                return response.json();
              })
              .then(function(myJson) {

                //Class for checking audit category
                /**
                 * 
                 * @param {string} category name off the category
                 * @returns {Object} Array arr = [category[audit names from auditrefs]]
                 */
                class Audits {
                    constructor(category) {
                        //this.arr[0] = category name
                        //this.arr[1] = List of all audits that belong to arr[0] category
                        this.arr = [category, []];
                        for (let i = 0; i < myJson.lighthouseResult.categories[category].auditRefs.length; i++) {
                            //Push every audit to array that belongs to category
                            this.arr[1].push(myJson.lighthouseResult.categories[category].auditRefs[i].id);
                        }
                    }
                }

                //Objects for checking audit category
                accessibility = new Audits(categories[0]);
                best_practices = new Audits(categories[1]);
                performance = new Audits(categories[2]);
                pwa = new Audits(categories[3]);
                seo = new Audits(categories[4]);

                //Hex Colors used for design: Green; Orange; Red;
                var colors = ['#18b663', '#fb8c00', '#e53935'];

                /**
                 * Function for checking FCP and FMP color
                 * @param {integer} value score from audit group
                 * @return {string} color
                 */
                function performanceColor(value) {
                    value = parseFloat(value);
                    if (value <= 2) {
                        return colors[0];
                    } else if (value <= 4) {
                        return colors[1];
                    } else {
                        return colors[2];
                    }
                }

                // 
                var firstContentfulPaintDisplayValue = myJson.lighthouseResult.audits['first-contentful-paint'].displayValue;
                document.querySelector('#first-contentful-paint span').innerText = firstContentfulPaintDisplayValue;
                document.querySelector('#first-contentful-paint span').style = `color: ${performanceColor(firstContentfulPaintDisplayValue)};`;

                var speedIndexDisplayValue = myJson.lighthouseResult.audits['speed-index'].displayValue;
                document.querySelector('#speed-index span').innerText = speedIndexDisplayValue;
                document.querySelector('#speed-index span').style = 'color: ' + (function (speedIndexDisplayValue) {
                    speedIndexDisplayValue = parseFloat(speedIndexDisplayValue);
                    if (speedIndexDisplayValue <= 4.3) {
                        return colors[0];
                    } else if (speedIndexDisplayValue <= 5.8) {
                        return colors[1];
                    } else {
                        return colors[2];
                    }
                })(speedIndexDisplayValue) + ';';

                var timeToInteractiveDisplayValue = myJson.lighthouseResult.audits['interactive'].displayValue;
                document.querySelector('#time-to-interactive span').innerText = timeToInteractiveDisplayValue;
                document.querySelector('#time-to-interactive span').style = 'color: ' + (function (timeToInteractiveDisplayValue) {
                    timeToInteractiveDisplayValue = parseFloat(timeToInteractiveDisplayValue);
                    if (timeToInteractiveDisplayValue <= 5.2) {
                        return colors[0];
                    } else if (timeToInteractiveDisplayValue <= 7.3) {
                        return colors[1];
                    } else {
                        return colors[2];
                    }})(timeToInteractiveDisplayValue) + ';';

                var firstMeaningfulPaintDisplayValue = myJson.lighthouseResult.audits['first-meaningful-paint'].displayValue;
                document.querySelector('#first-meaningful-paint span').innerText = firstMeaningfulPaintDisplayValue;
                document.querySelector('#first-meaningful-paint span').style = `color: ${performanceColor(firstMeaningfulPaintDisplayValue)};`;

                var firstCpuIdleDisplayValue = myJson.lighthouseResult.audits['first-cpu-idle'].displayValue;
                document.querySelector('#first-cpu-idle span').innerText = firstCpuIdleDisplayValue;
                document.querySelector('#first-cpu-idle span').style = 'color: ' + (function (firstCpuIdleDisplayValue) {
                    firstCpuIdleDisplayValue = parseFloat(firstCpuIdleDisplayValue);
                    if (firstCpuIdleDisplayValue <= 4.7) {
                        return colors[0];
                    } else if (firstCpuIdleDisplayValue <= 6.5) {
                        return colors[1];
                    } else {
                        return colors[2];
                    }})(firstCpuIdleDisplayValue) + ';';

                var estimatedInputLatencyDisplayValue = myJson.lighthouseResult.audits['estimated-input-latency'].displayValue;
                document.querySelector('#estimated-input-latency span').innerText = estimatedInputLatencyDisplayValue;
                document.querySelector('#estimated-input-latency span').style = 'color: ' + (function (estimatedInputLatencyDisplayValue) {
                    estimatedInputLatencyDisplayValue = parseFloat(estimatedInputLatencyDisplayValue);
                    if (estimatedInputLatencyDisplayValue <= 50) {
                        return colors[0];
                    } else if (estimatedInputLatencyDisplayValue <= 100) {
                        return colors[1];
                    } else {
                        return colors[2];
                    }})(estimatedInputLatencyDisplayValue) + ';';

                var audits = myJson.lighthouseResult.audits;
                var opportunities = document.querySelector("#opportunities");
                var inner = '';

                //Array for sorting audits
                var sortlist = [];
                //Push audits to list for sorting
                for (var z = 0; z < Object.keys(audits).length; z++) {
                    if (audits[Object.keys(audits)[z]].details) {
                        if (audits[Object.keys(audits)[z]].score < 1) {
                            if (audits[Object.keys(audits)[z]].score != null) {
                                sortlist.push([audits[Object.keys(audits)[z]].id, audits[Object.keys(audits)[z]].score]);
                            }
                        }
                    }
                }

                //Sorts the array low to high with anonymous function
                sortlist.sort(function(a, b) {
                    return a[1] - b[1];
                });

                //Add each array to inner string in correct order. From low to high.
                for (let i = 0; i < sortlist.length; i++) {
                    inner += `<div style="color: ${showAsPassed(audits[sortlist[i][0]])}; line-height: 1"><p> Audit Category: ${checkCategory(sortlist[i][0])}</p><p>${audits[sortlist[i][0]].title.replace(/[&\/\\#,+()$~%.'`":*?<>{}]/g,'')}</p></div>`;
                    inner += `<p>${audits[sortlist[i][0]].description.replace(/[<>`]/g, '')}</p>`;
                }

                opportunities.innerHTML = inner;
               /**
                * 
                * @param {object} audit object from requests json
                * @return {string} Hex color for design
                */
                function showAsPassed(audit) {
                    if (audit.score > .9) {
                        return colors[0];
                    } else if (audit.score > .5) {
                        return colors[1];
                    } else {
                        return colors[2];
                    }
                }

                /**
                 * 
                 * @param {string} audit Name of the audit
                 * @return {string} Name of correct category
                 */
                function checkCategory(audit) {
                    if (accessibility.arr[1].includes(audit)) {return accessibility.arr[0];}
                    if (best_practices.arr[1].includes(audit)) {return best_practices.arr[0];}
                    if (performance.arr[1].includes(audit)) {return performance.arr[0];}
                    if (pwa.arr[1].includes(audit)) {return pwa.arr[0];}
                    if (seo.arr[1].includes(audit)) {return seo.arr[0];}
                }
                let accessibility_score = parseInt(myJson.lighthouseResult.categories.accessibility.score*100);
                let best_practices_score = parseInt(myJson.lighthouseResult.categories['best-practices'].score*100);
                let performance_score = parseInt(myJson.lighthouseResult.categories.performance.score*100);
                let pwa_score = parseInt(myJson.lighthouseResult.categories.pwa.score*100);
                let seo_score = parseInt(myJson.lighthouseResult.categories.seo.score*100);
                
                /**
                 * 
                 * @param {int} score Score of category
                 * @return {string} css style
                 */
                function scoreStyle(score){                   
                    function checkColor(score){
                        if (score >= 90) {
                            return colors[0];
                        } else if (score >= 50) {
                            return colors[1];
                        } else {
                            return colors[2];
                        }
                    }
                    return `stroke: ${checkColor(score)}; stroke-dashoffset: ${100 - score}`;
                }

                document.getElementById('accessibility').innerHTML = `${accessibility_score}<span style="font-size:32px;"></span><span style="font-size: 14px; font-weight: 400; display: block;">Accessibility score</span>`;
                document.getElementById('accessibility_score').style = scoreStyle(accessibility_score);

                document.getElementById('best_practices').innerHTML = `${best_practices_score}<span style="font-size:32px;"></span><span style="font-size: 14px; font-weight: 400; display: block;">Best Practices score</span>`;
                document.getElementById('best_practices_score').style = scoreStyle(best_practices_score);

                document.getElementById('performance').innerHTML = `${performance_score}<span style="font-size:32px;"></span><span style="font-size: 14px; font-weight: 400; display: block;">Performance score</span>`;
                document.getElementById('performance_score').style = scoreStyle(performance_score);

                document.getElementById('pwa').innerHTML = `${pwa_score}<span style="font-size:32px;"></span><span style="font-size: 14px; font-weight: 400; display: block;">PWA score</span>`;
                document.getElementById('pwa_score').style = scoreStyle(pwa_score);

                document.getElementById('seo').innerHTML = `${seo_score}<span style="font-size:32px;"></span><span style="font-size: 14px; font-weight: 400; display: block;">SEO score</span>`;
                document.getElementById('seo_score').style = scoreStyle(seo_score);

                var arrSum = arr => arr.reduce((a,b) => a + b, 0);

                totalScore = arrSum([accessibility_score, best_practices_score, performance_score, pwa_score, seo_score]);

                document.querySelector('#report-icon svg').style = "color: " + (function (totalScore) {
                    if (totalScore >= 400) {
                        return colors[0];
                    } else if (totalScore > 200) {
                        return colors[1];
                    } else {
                        return colors[2];
                    }
                })(totalScore) + ';';

              });
        });
    }
});
