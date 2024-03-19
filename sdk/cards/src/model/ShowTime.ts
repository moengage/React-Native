/**
 * Time span during card can be shown
 * 
 * @author Abhishek Kumar
 * @since 1.0.0
 */
class ShowTime {

    /**
     * Start time for the time range.
     * @since 1.0.0
     */
    startTime: string;

    /**
     * End time for the time range.
     * @since 1.0.0
     */
    endTime: string;

    constructor(startTime: string, endTime: string) {
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

export default ShowTime;