import rcsolver from "../src/rcsolver";


describe("test", function () {

    this.timeout(Infinity);

    it('getRecaptcha', async () => {
        let result = await rcsolver("6LcJ7I0UAAAAAMHlziCMWU_ued-Q0g4VGJW_dgxZ");
        console.log(result);
    });
});
