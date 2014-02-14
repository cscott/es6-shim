var runArrayTests = function() {
  describe('Array', function() {
    var list = [5, 10, 15, 20];

    describe('Array.from()', function() {
      it('has a length of 1', function() {
        expect(Array.from.length).to.equal(1);
      });

      it('should create correct array from iterable', function() {
        (function() {
          expect(Array.from(arguments)).to.eql([0, 1, 2]);
        })(0, 1, 2);

        expect(Array.from([null, undefined, 0.1248, -0, 0])).to.eql(
          [null, undefined, 0.1248, -0, 0]
        );

        expect(Array.from([null, undefined, 0.1248, -0, 0].values())).to.eql(
          [null, undefined, 0.1248, -0, 0]
        );
      });

      it('should handle empty iterables correctly', function() {
        (function() {
          expect(Array.from(arguments)).to.eql([]);
        })();
      });

      it('should work with other constructors', function() {
        var Foo = function (length, args) {
          this.length = length;
        };
        var args = ['a', 'b', 'c'];
        var expected = new Foo(args.length);
        args.forEach(function (arg, index) {
          expected[index] = arg;
        });
        expect(Array.from.call(Foo, args)).to.eql(expected);
      });

      it('supports a map function', function() {
        var original = [1, 2, 3];
        var mapper = function (item) {
          return item * 2;
        };
        var mapped = Array.from(original, mapper);
        expect(mapped).to.eql([2, 4, 6]);
      });

      it('throws when provided a nonfunction second arg', function() {
        expect(function () { Array.from([], false); }).to.throw(TypeError);
        expect(function () { Array.from([], true); }).to.throw(TypeError);
        expect(function () { Array.from([], /a/g); }).to.throw(TypeError);
        expect(function () { Array.from([], {}); }).to.throw(TypeError);
        expect(function () { Array.from([], []); }).to.throw(TypeError);
        expect(function () { Array.from([], ''); }).to.throw(TypeError);
        expect(function () { Array.from([], 3); }).to.throw(TypeError);
      });

      it('supports a this arg', function() {
        var original = [1, 2, 3];
        var context = {};
        var mapper = function (item) {
          expect(this).to.equal(context);
          return item * 2;
        };
        var mapped = Array.from(original, mapper, context);
        expect(mapped).to.eql([2, 4, 6]);
      });

      it('throws when provided null or undefined', function() {
        expect(function () { Array.from(); }).to.throw(TypeError);
        expect(function () { Array.from(undefined); }).to.throw(TypeError);
        expect(function () { Array.from(null); }).to.throw(TypeError);
      });

      it('returns [] when given 3', function() {
        expect(Array.from(3)).to.eql([]);
      });

      it('removes holes', function() {
        var input = [0, , 2];
        var result = Array.from([0, , 2]);
        expect(1 in input).to.be.false;
        expect(1 in result).to.be.true;
        expect(result).to.eql([0, undefined, 2]);
      });
    });

    describe('Array.of()', function() {
      it('should create correct array from arguments', function() {
        expect(Array.of(1, null, undefined)).to.eql([1, null, undefined]);
      });
    });

    describe('Array#copyWithin', function() {
      it('has the right arity', function() {
        expect(Array.prototype.copyWithin.length).to.equal(2);
      });

      it('works with 2 args', function() {
        expect([1, 2, 3, 4, 5].copyWithin(0, 3)).to.eql([4, 5, 3, 4, 5]);
        expect([1, 2, 3, 4, 5].copyWithin(1, 3)).to.eql([1, 4, 5, 4, 5]);
        expect([1, 2, 3, 4, 5].copyWithin(1, 2)).to.eql([1, 3, 4, 5, 5]);
        expect([1, 2, 3, 4, 5].copyWithin(2, 2)).to.eql([1, 2, 3, 4, 5]);
      });

      it('works with 3 args', function() {
        expect([1, 2, 3, 4, 5].copyWithin(0, 3, 4)).to.eql([4, 2, 3, 4, 5]);
        expect([1, 2, 3, 4, 5].copyWithin(1, 3, 4)).to.eql([1, 4, 3, 4, 5]);
        expect([1, 2, 3, 4, 5].copyWithin(1, 2, 4)).to.eql([1, 3, 4, 4, 5]);
      });

      it('works with negative args', function() {
        expect([1, 2, 3, 4, 5].copyWithin(0, -2)).to.eql([4, 5, 3, 4, 5]);
        expect([1, 2, 3, 4, 5].copyWithin(0, -2, -1)).to.eql([4, 2, 3, 4, 5]);
        expect([1, 2, 3, 4, 5].copyWithin(-4, -3, -2)).to.eql([1, 3, 3, 4, 5]);
        expect([1, 2, 3, 4, 5].copyWithin(-4, -3, -1)).to.eql([1, 3, 4, 4, 5]);
        expect([1, 2, 3, 4, 5].copyWithin(-4, -3)).to.eql([1, 3, 4, 5, 5]);
      });

      it('works with arraylike objects', function() {
        var args = (function () { return arguments; }(1, 2, 3));
        expect(Array.isArray(args)).not.to.be.ok;
        var argsClass = Object.prototype.toString.call(args);
        expect(Array.prototype.slice.call(args)).to.eql([1, 2, 3]);
        Array.prototype.copyWithin.call(args, -2, 0);
        expect(Array.prototype.slice.call(args)).to.eql([1, 1, 2]);
        expect(Object.prototype.toString.call(args)).to.equal(argsClass);
      });
    });

    describe('Array#find', function() {
      it('should have a length of 1', function() {
        expect(Array.prototype.find.length).to.equal(1);
      });

      it('should find item by predicate', function() {
        var result = list.find(function(item) { return item === 15; });
        expect(result).to.equal(15);
      });

      it('should return undefined when nothing matched', function() {
        var result = list.find(function(item) { return item === 'a'; });
        expect(result).to.equal(undefined);
      });

      it('should throw TypeError when function was not passed', function() {
        expect(function() { list.find(); }).to.throw(TypeError);
      });

      it('should receive all three parameters', function() {
        var index = list.find(function(value, index, arr) {
          expect(list[index]).to.equal(value);
          expect(list).to.eql(arr);
          return false;
        });
        expect(index).to.equal(undefined);
      });

      it('should work with the context argument', function() {
        var context = {};
        [1].find(function() { expect(this).to.equal(context); }, context);
      });

      it('should work with an array-like object', function() {
        var obj = { '0': 1, '1': 2, '2': 3, length: 3 };
        var found = Array.prototype.find.call(obj, function(item) { return item === 2; });
        expect(found).to.equal(2);
      });

      it('should work with an array-like object with negative length', function() {
        var obj = { '0': 1, '1': 2, '2': 3, length: -3 };
        var found = Array.prototype.find.call(obj, function(item) {
          throw new Error('should not reach here');
        });
        expect(found).to.equal(undefined);
      });

      it('should work with a sparse array', function() {
        var obj = [1,,undefined];
        var seen = [];
        var found = Array.prototype.find.call(obj, function(item, idx) {
          seen.push([idx, item]);
          return false;
        });
        expect(found).to.equal(undefined);
        expect(seen).to.eql([[0,1],[2,undefined]]);
      });

      it('should work with a sparse array-like object', function() {
        var obj = { '0': 1, '2': undefined, length: 3.2 };
        var seen = [];
        var found = Array.prototype.find.call(obj, function(item, idx) {
          seen.push([idx, item]);
          return false;
        });
        expect(found).to.equal(undefined);
        expect(seen).to.eql([[0,1],[2,undefined]]);
      });
    });

    describe('Array#findIndex', function() {
      it('should have a length of 1', function() {
        expect(Array.prototype.findIndex.length).to.equal(1);
      });

      it('should find item key by predicate', function() {
        var result = list.findIndex(function(item) { return item === 15; });
        expect(result).to.equal(2);
      });

      it('should return -1 when nothing matched', function() {
        var result = list.findIndex(function(item) { return item === 'a'; });
        expect(result).to.equal(-1);
      });

      it('should throw TypeError when function was not passed', function() {
        expect(function() { list.findIndex(); }).to.throw(TypeError);
      });

      it('should receive all three parameters', function() {
        var index = list.findIndex(function(value, index, arr) {
          expect(list[index]).to.equal(value);
          expect(list).to.eql(arr);
          return false;
        });
        expect(index).to.equal(-1);
      });

      it('should work with the context argument', function() {
        var context = {};
        [1].findIndex(function() { expect(this).to.equal(context); }, context);
      });

      it('should work with an array-like object', function() {
        var obj = { '0': 1, '1': 2, '2': 3, length: 3 };
        var foundIndex = Array.prototype.findIndex.call(obj, function(item) { return item === 2; });
        expect(foundIndex).to.equal(1);
      });

      it('should work with an array-like object with negative length', function() {
        var obj = { '0': 1, '1': 2, '2': 3, length: -3 };
        var foundIndex = Array.prototype.findIndex.call(obj, function(item) {
          throw new Error('should not reach here');
        });
        expect(foundIndex).to.equal(-1);
      });

      it('should work with a sparse array', function() {
        var obj = [1,,undefined];
        var seen = [];
        var foundIndex = Array.prototype.findIndex.call(obj, function(item, idx) {
          seen.push([idx, item]);
          return item === undefined;
        });
        expect(foundIndex).to.equal(2);
        expect(seen).to.eql([[0,1],[2,undefined]]);
      });

      it('should work with a sparse array-like object', function() {
        var obj = { '0': 1, '2': undefined, length: 3.2 };
        var seen = [];
        var foundIndex = Array.prototype.findIndex.call(obj, function(item, idx) {
          seen.push([idx, item]);
          return false;
        });
        expect(foundIndex).to.equal(-1);
        expect(seen).to.eql([[0,1],[2,undefined]]);
      });
    });

    describe('ArrayIterator', function() {
      var arrayIterator = [1, 2, 3].values();

      describe('ArrayIterator#next', function() {
        it('should work when applied to an ArrayIterator', function() {
          expect(arrayIterator.next.apply(arrayIterator)).to.eql({value:1,done:false});
          expect(arrayIterator.next.apply(arrayIterator)).to.eql({value:2,done:false});
          expect(arrayIterator.next.apply(arrayIterator)).to.eql({value:3,done:false});
          expect(arrayIterator.next.apply(arrayIterator)).to.eql({value:undefined,done:true});
        });

        it('throws when not applied to an ArrayIterator', function() {
          expect(function () { arrayIterator.next.apply({}); }).to.throw(TypeError);
        });
      });
    });

    describe('Array#keys', function() {
      it('should have a length of zero', function() {
        expect(Array.prototype.keys.length).to.equal(0);
      });

      var mylist = [5, 10, 15, 20];
      var keys = mylist.keys();
      it('should return 0 on first object', function() {
        expect(keys.next()).to.eql({value: 0, done: false});
      });
      it('should return 1 on second object', function() {
        expect(keys.next()).to.eql({value: 1, done: false});
      });
      it('should return 2 on third object', function() {
        expect(keys.next()).to.eql({value: 2, done: false});
      });
      it('should return 3 on fourth object', function() {
        expect(keys.next()).to.eql({value: 3, done: false});
      });
      it('should set done on completing iteration', function() {
        expect(keys.next()).to.eql({value: undefined, done: true});
      });
      it('once done it should stay done', function() {
        mylist.push(4);
        expect(keys.next()).to.eql({value: undefined, done: true});
      });

      it('should not skip sparse keys', function() {
        var sparse = [1];
        sparse[2] = 3;
        var keys = sparse.keys();
        expect(keys.next()).to.eql({value: 0, done: false});
        expect(keys.next()).to.eql({value: 1, done: false});
        expect(keys.next()).to.eql({value: 2, done: false});
        expect(keys.next()).to.eql({value: undefined, done: true});
      });
    });

    describe('Array#values', function() {
      it('should have a length of zero', function() {
        expect(Array.prototype.values.length).to.equal(0);
      });

      var mylist = [5, 10, 15, 20];
      var values = mylist.values();
      it('should return 5 on first object', function() {
        expect(values.next()).to.eql({value: 5, done: false});
      });
      it('should return 10 on second object', function() {
        expect(values.next()).to.eql({value: 10, done: false});
      });
      it('should return 15 on third object', function() {
        expect(values.next()).to.eql({value: 15, done: false});
      });
      it('should return 20 on fourth object', function() {
        expect(values.next()).to.eql({value: 20, done: false});
      });
      it('should set done on completing iteration', function() {
        expect(values.next()).to.eql({value: undefined, done: true});
      });
      it('once done it should stay done', function() {
        mylist.push(4);
        expect(values.next()).to.eql({value: undefined, done: true});
      });

      it('should not skip sparse values', function() {
        var sparse = [1];
        sparse[2] = 3;
        var values = sparse.values();
        expect(values.next()).to.eql({value: 1, done: false});
        expect(values.next()).to.eql({value: undefined, done: false});
        expect(values.next()).to.eql({value: 3, done: false});
        expect(values.next()).to.eql({value: undefined, done: true});
      });
    });

    describe('Array#entries', function() {
      it('should have a length of zero', function() {
        expect(Array.prototype.entries.length).to.equal(0);
      });

      var mylist = [5, 10, 15, 20];
      var entries = mylist.entries();
      it('should return [0, 5] on first object', function() {
        var val = entries.next();
        expect(val).to.eql({value: [0, 5], done: false});
      });
      it('should return [1, 10] on first object', function() {
        var val = entries.next();
        expect(val).to.eql({value: [1, 10], done: false});
      });
      it('should return [2, 15] on first object', function() {
        var val = entries.next();
        expect(val).to.eql({value: [2, 15], done: false});
      });
      it('should return [3, 20] on first object', function() {
        var val = entries.next();
        expect(val).to.eql({value: [3, 20], done: false});
      });
      it('should set done on completing iteration', function() {
        var val = entries.next();
        expect(val).to.eql({value: undefined, done: true});
      });
      it('once done it should stay done', function() {
        mylist.push(4);
        var val = entries.next();
        expect(val).to.eql({value: undefined, done: true});
      });

      it('should not skip sparse entries', function() {
        var sparse = [1];
        sparse[2] = 3;
        var entries = sparse.entries();
        expect(entries.next()).to.eql({value: [0, 1], done: false});
        expect(entries.next()).to.eql({value: [1, undefined], done: false});
        expect(entries.next()).to.eql({value: [2, 3], done: false});
        expect(entries.next()).to.eql({value: undefined, done: true});
      });
    });

    describe('Array#fill', function() {
      it('has the right length', function() {
        expect(Array.prototype.fill.length).to.equal(1);
      });

      it('works with just a value', function() {
        var original = [1, 2, 3, 4, 5, 6];
        var filled = [-1, -1, -1, -1, -1, -1];

        expect(original.fill(-1)).to.eql(filled);
      });

      it('accepts a positive start index', function() {
        var original = [1, 2, 3, 4, 5, 6];
        var filled = [1, 2, 3, -1, -1, -1];

        expect(original.fill(-1, 3)).to.eql(filled);
      });

      it('accepts a negative start index', function() {
        var original = [1, 2, 3, 4, 5, 6];
        var filled = [1, 2, 3, -1, -1, -1];

        expect(original.fill(-1, -3)).to.eql(filled);
      });

      it('accepts a large start index', function() {
        var original = [1, 2, 3, 4, 5, 6];
        var filled = [1, 2, 3, 4, 5, 6];

        expect(original.fill(-1, 9)).to.eql(filled);
      });
    });
  });
};

describe('clean Object.prototype', runArrayTests);

describe('polluted Object.prototype', function() {
  Object.prototype[1] = 42;
  runArrayTests();
  delete Object.prototype[1];
});
