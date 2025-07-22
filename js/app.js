export let computeLevelProgress = (xp) => {
        // Base scaling factor (standard Code::Stats uses 300)
        const scalingBase = 100;

        // Compute the level
        let level = Math.floor(Math.pow(xp / scalingBase, 1 / 3));

        // XP required to reach the start of this level
        let xpCurrent = scalingBase * Math.pow(level, 3);

        // XP required to reach the next level
        let xpNext = scalingBase * Math.pow(level + 1, 3);

        // Progress within the level
        let progress = xp - xpCurrent;
        let needed = xpNext - xpCurrent;

        // Avoid division by zero (could happen if needed == 0)
        let percent = needed > 0 ? (progress / needed) * 100 : 100;

        return {
            'level': level,
            'xp': xp,
            'xp_into_level': Math.round(progress),
            'xp_needed_for_next': Math.round(needed),
            'percent_to_next': Math.round(percent, 2)
        }
}

export const getCodeStats = async () => {
    try {
        const response = await fetch('https://codestats.net/api/users/zedrik-pineda');
        const respData = Object.values(await response.json());

        const excludedLanguages = ["Log", "Plain text", "Properties", "scminput"];

        let dateCount = 0;
        let startDate = "";
        Object.entries(respData[0]).forEach(([key, value]) => {
            dateCount++;
            if (dateCount == 1) {
                startDate = moment(key).format('MMMM D, YYYY');
                return;
            }
        });

        

        let data = "";
        // Loop languages
        Object.entries(respData[1]).forEach(([language, exp_data]) => {
            if (!excludedLanguages.includes(language)) {
                let level = computeLevelProgress(exp_data.xps);
                data += `
                            <div class="col-md-6 col-sm-12">
                                <h4 class='text-start'><strong>${language}</strong> Level: ${level['level']}</h4>
                                <div class="progress position-relative" role="progressbar" aria-label="Progress example" aria-valuenow="${level['percent_to_next']}" aria-valuemin="0" aria-valuemax="100">
                                    <div class="progress-bar bg-success" style="width: ${level['percent_to_next']}%;"></div>
                                    <span class="position-absolute w-100 text-center text-black">${level['percent_to_next']}%</span>
                                </div>
                            </div>
                        `;
            }
        });

        let profirciencyData = {
            'Data': data,
            'StartDate': startDate,
        }

        return profirciencyData;

    } catch (error) {
        console.error('Error:', error);
    }
};