import { namedNode } from '@rdfjs/data-model';
import ComunicaEngine from 'ldflex-comunica';
import SolidUpdateEngine from '../SolidUpdateEngine';

/**
 * LDflex property resolver that returns a new path
 * starting from the property name as a subject.
 *
 * For example, when triggered as
 *     data['http://person.example/#me'].friends.firstName
 * it will create a path with `http://person.example/#me` as subject
 * and then resolve `friends` and `firstName` against the JSON-LD context.
 *
 * In case a source object is given as input, data will be pulled from there.
 */
export default class SubjectPathResolver {
  constructor(pathFactory, source) {
    this._paths = pathFactory;
    this._source = source;
  }

  /** Resolve all string properties (not Symbols) */
  supports(property) {
    return typeof property === 'string';
  }

  resolve(property) {
    return this._createSubjectPath(namedNode(property));
  }

  _createSubjectPath(subject) {
    const source = this._source || Promise.resolve(subject).catch(() => null);
    const queryEngine = new SolidUpdateEngine(source, new ComunicaEngine(source));
    return this._paths.create({ queryEngine }, { subject });
  }
}