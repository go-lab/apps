/**
 * Created by sikkenj on 13-1-2016.
 */

"use strict";

namespace ut.commons.tsutils {
   "use strict";

   export interface EnumValueDescription {
      value: number,
      name: string
   }

   export function enumToValueDescriptions(enumType: any): EnumValueDescription[] {
      const enumValueDescriptions: EnumValueDescription[] = []
      for (let propertyName in enumType) {
         if (typeof enumType[propertyName] === "number") {
            enumValueDescriptions.push({
               value: enumType[propertyName],
               name: propertyName
            })
         }
      }
      return enumValueDescriptions
   }

   export function enumToValueDescription(enumType: any, value: number): EnumValueDescription {
      if (typeof enumType[value] === "string") {
         return {
            value: value,
            name: enumType[value]
         }
      } else {
         return null
      }
   }

   export function enumToNames(enumType: any): string[] {
      const enumNames: string[] = []
      for (let propertyName in enumType) {
         if (typeof enumType[propertyName] === "number") {
            enumNames.push(propertyName)
         }
      }
      return enumNames
   }

   export function enumToValues(enumType: any): number[] {
      const enumValues: number[] = []
      for (let propertyName in enumType) {
         const enumValue = enumType[propertyName]
         if (typeof enumValue === "number") {
            enumValues.push(enumValue)
         }
      }
      return enumValues
   }

   export function nameToEnum(enumType: any, name: string, ignoreCase: boolean = false): number {
      function getCheckValue(value: string): string {
         if (ignoreCase) {
            return value.toLowerCase()
         } else {
            return value
         }
      }

      let checkName = getCheckValue(name)
      for (let propertyName in enumType) {
         if (getCheckValue(propertyName) === checkName) {
            return enumType[propertyName]
         }
      }
      return null
   }

   /*

    the only added value of Seq<t> to Array<T> is isEmpty/clear/insert/remove
    perhaps later more added value will be found

    export class Seq<T> {

    protected _array = new Array<T>()

    constructor() {
    //
    }

    get array(): Array<T> {
    return this.array
    }

    get length(): number {
    return this._array.length
    }

    isEmpty(): boolean {
    return this._array.length === 0
    }

    clear(): void {
    this._array.length = 0
    }

    push(value: T): number {
    return this._array.push(value)
    }

    insert(index: number, value: T): void {
    this._array.splice(index, 0, value)
    }

    remove(index: number): T {
    const value = this.get(index)
    this._array.splice(index, 1)
    return value
    }

    get(index: number): T {
    return this._array[index]
    }

    indexOf(value: T, fromIndex = 0): number {
    return this._array.indexOf(value, fromIndex)
    }

    lastIndexOf(value: T, fromIndex = this.length - 1): number {
    return this._array.lastIndexOf(value, fromIndex)
    }

    contains(value: T): boolean {
    return this._array.indexOf(value) >= 0
    }

    forEach(callbackfn: (value: T, index: number, array: T[]) => void, thisArg?: any): void {
    this._array.forEach(callbackfn)
    }

    map<U>(callbackfn: (value: T, index: number, array: T[]) => U, thisArg?: any): U[] {
    return this._array.map(callbackfn)
    }

    filter(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): T[] {
    return this._array.filter(callbackfn)
    }

    every(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean {
    return this._array.every(callbackfn)
    }

    some(callbackfn: (value: T, index: number, array: T[]) => boolean, thisArg?: any): boolean {
    return this._array.every(callbackfn)
    }

    sort(compareFn?: (a: T, b: T) => number): Seq<T> {
    this._array.sort(compareFn)
    return this
    }
    }

    */

   export class Map<T> {

      private _mapObject = {}

      constructor() {
         //
      }

      clone(): Map<T> {
         const clonedMap = new Map<T>()
         this.keys().forEach((key): void => {
            clonedMap.put(key, this.get(key))
         })
         return clonedMap
      }

      getJson(): any {
         const json = {}
         this.keys().forEach((key) => {
            json[key] = this.get(key)
         })
         return json
      }

      loadFromJson(json: any): void {
         this.clear()
         for (let key in json) {
            this.put(key, json[key])
         }
      }

      get length(): number {
         return Object.keys(this._mapObject).length
      }

      get mapObject(): any {
         return this._mapObject
      }

      isEmpty(): boolean {
         return this.keys().length === 0
      }

      clear(): void {
         this._mapObject = {}
      }

      containsKey(key: string): boolean {
         return typeof this._mapObject[key] !== "undefined"
      }

      get(key: string): T {
         return this._mapObject[key]
      }

      getOrElse(key: string, defaultValue: T): T {
         if (this.containsKey(key)) {
            return this.get(key)
         } else {
            return defaultValue
         }
      }

      put(key: string, value: T): T {
         this._mapObject[key] = value
         return value
      }

      remove(key: string): T {
         const value = this.get(key)
         delete this._mapObject[key]
         return value
      }

      keys(): string[] {
         return Object.keys(this._mapObject)
      }

      values(): T[] {
         return this.keys().map((key) => {
            return this.get(key)
         })
      }

   }

   export interface HasGetId {
      getId: () => string
   }

   export interface HasId {
      id: string
   }

   interface KeyValueObject {
      key: any
      value: any
   }

   export class IdMap<T extends HasGetId | HasId | string, U> {

      private _mapValuesObject = {}

      constructor() {
         //
      }

      clone(): IdMap<T, U> {
         const clonedMap = new IdMap<T, U>()
         this.keys().forEach((key): void => {
            clonedMap.put(key, this.get(key))
         })
         return clonedMap
      }

      // getJson(): any {
      //    const json = {}
      //    this.keyStrings().forEach((key) => {
      //       json[key] = this.getByString(key)
      //    })
      //    return json
      // }
      //
      // loadFromJson(json: any): void {
      //    this.clear()
      //    for (let key in json) {
      //       this.put(key, json[key])
      //    }
      // }

      get length(): number {
         return this.keyStrings().length
      }

      get mapValuesObject(): any {
         return this._mapValuesObject
      }

      isEmpty(): boolean {
         return this.keyStrings().length === 0
      }

      clear(): void {
         this._mapValuesObject = {}
      }

      private getKeyString(key: T): string {
         if (typeof key === "string") {
            return <any>key
         } else if (typeof key["getId"] === "function") {
            return key["getId"]()
         } else {
            return key["id"]
         }
      }

      containsKeyString(key: string): boolean {
         return typeof this._mapValuesObject[key] !== "undefined"
      }

      containsKey(key: T): boolean {
         return this.containsKeyString(this.getKeyString(key))
      }

      getByString(key: string): U {
         if (this.containsKeyString(key)) {
            return this._mapValuesObject[key].value
         } else {
            return void 0
         }
      }

      getKeyByString(key: string): T {
         if (this.containsKeyString(key)) {
            return this._mapValuesObject[key].key
         } else {
            return void 0
         }
      }

      get(key: T): U {
         return this.getByString(this.getKeyString(key))
      }

      getOrElse(key: T, defaultValue: U): U {
         const keyString = this.getKeyString(key)
         if (this.containsKeyString(keyString)) {
            return this.getByString(keyString)
         } else {
            return defaultValue
         }
      }

      getOrElseUpdate(key: T, defaultValue: U): U {
         const keyString = this.getKeyString(key)
         if (this.containsKeyString(keyString)) {
            return this.getByString(keyString)
         } else {
            return this.put(key, defaultValue)
         }
      }

      put(key: T, value: U): U {
         this._mapValuesObject[this.getKeyString(key)] = {
            key: key,
            value: value
         }
         return value
      }

      remove(key: T): U {
         const keyString = this.getKeyString(key)
         const keyValue = this._mapValuesObject[keyString]
         delete this._mapValuesObject[keyString]
         if (keyValue) {
            return keyValue.value
         } else {
            return void 0
         }
      }

      keyStrings(): string[] {
         return Object.keys(this._mapValuesObject)
      }

      keys(): T[] {
         return this.keyStrings().map((key) => {
            return this.getKeyByString(key)
         })
      }

      values(): U[] {
         return this.keyStrings().map((key) => {
            return this.getByString(key)
         })
      }

      toString(): string {
         return `IdMap([${this.keys().join((", "))}])`
      }
   }

   export class IdSet<T extends HasGetId | HasId | string> {

      private _elementMapObject = {}

      constructor() {
         //
      }

      clone(): IdSet<T> {
         const clonedSet = new IdSet<T>()
         clonedSet.addAll(this.toArray())
         return clonedSet
      }

      get length(): number {
         return Object.keys(this._elementMapObject).length
      }

      isEmpty(): boolean {
         return this.length === 0
      }

      clear(): void {
         this._elementMapObject = {}
      }

      private getElementId(element: T): string {
         if (typeof element === "string") {
            return <any>element
         } else if (typeof element["getId"] === "function") {
            return element["getId"]()
         } else {
            return element["id"]
         }
      }

      private getElementArray(elements: T[] | IdSet<T>): T[] {
         if (Array.isArray(elements)) {
            return elements
         } else if (elements instanceof IdSet) {
            return elements.toArray()
         } else {
            console.error(elements)
            throw new Error(`Expected an Array or IdSet, but got something else`)
         }
      }

      add(element: T): boolean {
         const elementId = this.getElementId(element)
         if (this.containsId(elementId)) {
            return true
         } else {
            this._elementMapObject[elementId] = element
            return false
         }
      }

      addAll(elements: T[] | IdSet<T>): boolean {
         let result = false
         this.getElementArray(elements).forEach((element): void => {
            const elementResult = this.add(element)
            result = result || elementResult
         })
         return result
      }

      remove(element: T): boolean {
         return this.removeById(this.getElementId(element))
      }

      removeById(elementId: string): boolean {
         if (this.containsId(elementId)) {
            delete this._elementMapObject[elementId]
            return true
         } else {
            return false
         }
      }

      removeAll(elements: T[] | IdSet<T>): boolean {
         let result = false
         this.getElementArray(elements).forEach((element): void => {
            const elementResult = this.remove(element)
            result = result || elementResult
         })
         return result
      }

      getById(elementId: string): T {
         return this._elementMapObject[elementId]
      }

      containsId(elementId: string): boolean {
         return typeof this._elementMapObject[elementId] !== "undefined"
      }

      contains(element: T): boolean {
         return this.containsId(this.getElementId(element))
      }

      containsAll(elements: T[] | IdSet<T>): boolean {
         for (const element of this.getElementArray(elements)) {
            if (!this.contains(element)) {
               return false
            }
         }
         return true
      }

      containsSome(elements: T[] | IdSet<T>): boolean {
         for (const element of this.getElementArray(elements)) {
            if (this.contains(element)) {
               return true
            }
         }
         return false
      }

      toArray(): T[] {
         return Object.keys(this._elementMapObject).map((key) => {
            return this._elementMapObject[key]
         })
      }

      toString(): string {
         return `IdSet([${Object.keys(this._elementMapObject).join((", "))}])`
      }
   }

   export interface TestData {
      title?: string
   }

   export class TestDataStore<T extends TestData> {
      private _store = new Map<T[]>()

      constructor() {
         //
      }

      getTestDatas(category: string): T[] {
         if (!this._store.containsKey(category)) {
            this._store.put(category, [])
         }
         return this._store.get(category)
      }

      addTestData(category: string, title: string, testData: T): void {
         if (!title && !testData.title) {
            throw new Error("Cannot find title, the title parameter must be specified or the test data must have a title property")
         }
         if (title && testData.title && title !== testData.title) {
            throw new Error(`The title parameter (${title}) is not equal to the title property (${testData.title}) of the test data`)
         }
         if (!testData.title) {
            testData.title = title
         }
         this.getTestDatas(category).push(testData)
      }

      getData(category: string, title: string): T {
         for (let testData of this.getTestDatas(category)) {
            if (testData.title === title) {
               return testData
            }
         }
         return null
      }

      getCategories(): string[] {
         return this._store.keys()
      }
   }

   export const appendToArray = <T>(array1: T[], array2: T[]): T[] => {
      array2.forEach((element): void => {
         array1.push(element)
      })
      return array1
   }

   export const removeDuplicatesFromArray = <T>(array: T[]): T[] => {
      return array.filter(function (item, pos, self) {
         return self.indexOf(item) === pos;
      })
   }

   export const timeCode = (code: () => void, times: number, label: string): void => {
      const startMillis = Date.now()
      for (let i = 0; i < times; i++) {
         code()
      }
      const millisUsed = Date.now() - startMillis
      console.log(`${label} took: ${millisUsed / times} msec.`)
   }

}
