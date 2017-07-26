describe('retrieveEvent', function() {
    it('returns window.event if available', function() {
        var evt = window.event = new MouseEvent('click');
        expect(popupBlocker.retrieveEvent()).to.be.equal(evt);
        window.event = undefined;
    });
    it('retrieves value from the call stack when window.event is unavailable', function(done) {
        var evt =  new CustomEvent('test');
        evt.target = document;
        var retrieved;
        setTimeout(function() {
            window.event = undefined;
            expect(window.event).to.be.an('undefined');
            retrieved = popupBlocker.retrieveEvent();
            expect(retrieved).to.be.equal(evt);
            done();
        }.bind(null, evt), 100);
    });
});

describe('verifyEvent', function() {
    it('returns true for non-dispatched events', function() {
        var evt = new MouseEvent('click', { clientX: 100, clientY: 100 });
        expect(popupBlocker.verifyEvent(evt)).to.be.true;
    });
    it('returns false for events of which currentTarget is document', function() {
        var evt = new MouseEvent('click', { clientX: 100, clientY: 100 });
        document.addEventListener('click', function(evt) {
            expect(popupBlocker.verifyEvent(evt)).to.be.false;
        });
        document.dispatchEvent(evt);
    });
});

describe('maybeOverlay', function() {
    it('detects position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647', function() {
        var el = document.createElement('div');
        el.style.cssText = 'position:absolute;left:0;top:0;width:100%;height:100%;z-index:2147483647';
        document.body.appendChild(el);
        expect(popupBlocker.maybeOverlay(el)).to.be.true;
        document.body.removeChild(el);
    });
});