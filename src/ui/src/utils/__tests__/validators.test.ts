import * as R from 'ramda';
import Validators from '../validators/oci';

describe(`OCI Compliant URIs`, () => {
  const RegistryData = {
    Reference: {
      VALID: [
        'registry.com:8080/myapp:tag',
        'registry.com:8080/myapp@sha256:be178c0543eb17f5f3043021c9e5fcf30285e557a4fc309cce97ff9ca6182912',
        'registry.com:8080/myapp:tag2@sha256:be178c0543eb17f5f3043021c9e5fcf30285e557a4fc309cce97ff9ca6182912',
        'localhost:8080/name@sha256:be178c0543eb17f5f3043021c9e5fcf30285e557a4fc309cce97ff9ca6182912',
        'localhost@sha256:be178c0543eb17f5f3043021c9e5fcf30285e557a4fc309cce97ff9ca6182912'
      ],
      INVALID: [
        'registry.com:8080/myapp@sha256:badbadbadbad',
        'registry.com:8080/myapp:invalid~tag',
        'bad_hostname.com:8080/myapp:tag',
        'localhost:http/name@sha256:be178c0543eb17f5f3043021c9e5fcf30285e557a4fc309cce97ff9ca6182912',
        'registry.com:8080/myapp@bad',
        'registry.com:8080/myapp@2bad'
      ]
    },
    Domain: {
      VALID: [
        'test.com',
        'test.com:10304',
        'localhost',
        'localhost:8080',
        'a',
        'a.b',
        'ab.cd.com',
        'a-b.com',
        'ab.c-om',
        '0101.com',
        '001a.com',
        'b.gbc.io:443',
        'b.gbc.io',
        'xn--n3h.com',
        'Asdf.com'
      ],
      INVALID: [
        'test.com:http',
        '-ab.com',
        'ab-.com',
        'ab.-com',
        'ab.com-'
      ]
    },
    Name: {
      VALID: [
        'short',
        'simple/name',
        'library/ubuntu',
        'docker/stevvooe/app',
        'aa/aa/aa/aa/aa/aa/aa/aa/aa/bb/bb/bb/bb/bb/bb',
        'aa/aa/bb/bb/bb',
        'a/a/a/a',
        'a',
        'a/aa',
        'a/aa/a',
        'foo.com',
        'foo.com:8080/bar',
        'foo.com/bar',
        'foo.com/bar/baz',
        'localhost:8080/bar',
        'sub-dom1.foo.com/bar/baz/quux',
        'blog.foo.com/bar/baz',
        'aa-a/a',
        'foo_bar',
        'foo_bar.com',
        'foo.com/foo_bar',
        'b.gcr.io/test.example.com/my-app',
        'xn--n3h.com/myimage',
        'xn--7o8h.com/myimage',
        'example.com/xn--7o8h.com/myimage',
        'example.com/some_separator__underscore/myimage',
        'do__cker/docker',
        'b.gcr.io/test.example.com/my-app',
        'registry.io/foo/project--id.module--name.ver---sion--name',
        'Asdf.com/foo/bar'
      ],
      INVALID: [
        '',
        'a/a/a/a/',
        'a//a/a',
        'foo.com/',
        'foo.com:http/bar',
        'a^a',
        'aa/asdf$$^/aa',
        'asdf$$^/aa',
        'a-/a/a/a',
        'foo.com/a-/a/a',
        '-foo/bar',
        'foo/bar-',
        'foo-/bar',
        'foo/-bar',
        '_foo/bar',
        'foo_bar.com:8080',
        'foo_bar.com:8080/app',
        '____/____',
        '_docker/_docker',
        'docker_/docker_',
        'example.com/__underscore/myimage',
        'example.com/..dots/myimage',
        'example.com/.dots/myimage',
        'example.com/nodouble..dots/myimage',
        'example.com/nodouble..dots/myimage',
        'docker./docker',
        '.docker/docker',
        'docker-/docker',
        '-docker/docker',
        'do..cker/docker',
        'do__cker:8080/docker',
        'Foo/FarB'
      ]
    }
  } as const;

  test(`should return 'true' for valid references`, () => {
    R.forEach(validReference =>
      expect(Validators.isReference(validReference)).toEqual(true), RegistryData.Reference.VALID
    );
  });
  
  test(`should return 'false' for invalid references`, () => {
    R.forEach(invalidReference =>
      expect(Validators.isReference(invalidReference)).toEqual(false), RegistryData.Reference.INVALID
    );
  });

  test(`should return 'true' for valid domains`, () => {
    R.forEach(validDomain => expect(Validators.Anchored.isDomain(validDomain)).toEqual(true), RegistryData.Domain.VALID);
  });

  test(`should return 'false' for invalid domains`, () => {
    R.forEach(invalidDomain => expect(Validators.Anchored.isDomain(invalidDomain)).toEqual(false), RegistryData.Domain.INVALID);
  });

  test(`should return 'true' for valid names`, () => {
    R.forEach(validName => expect(Validators.Anchored.isName(validName)).toEqual(true), RegistryData.Name.VALID);
  });

  test(`should return 'false' for invalid names`, () => {
    R.forEach(invalidName => expect(Validators.Anchored.isName(invalidName)).toEqual(false), RegistryData.Name.INVALID);
  });
});
