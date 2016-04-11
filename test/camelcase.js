describe('camel cased relationships', function () {
  var info = {
     "type": "order_template_images",
    "baseUrl": "/api",
    "relates": {
      "order_template": "order_templates",
      "order": "orders",
      "image": "images"
    }
  };

  var apiData = {
    "data": {
      "id": 1,
      "type": "order_template_images",
      "links": {
        "order": {
          "linkage": {
            "id": 3,
            "type": "orders"
          }
        },
        "order_template": {
          "linkage": {
            "id": 4,
            "type": "order_templates"
          }
        },
        "image": {
          "linkage": {
            "id": 2,
            "type": "images"
          }
        }
      }
    }
  };

  var simpleData = {
    "id": "1",
    "imageId": 2,
    "orderId": 3,
    "orderTemplateId": 4
  };


  it('should convert jsonapi data to simple', function (done) {
    var result = transform.toSimple(apiData);
    expect(result).to.eql(simpleData);
    done();
  });
  it('should convert simple data to jsonapi', function (done) {
    var result = transform.toJsonApi(simpleData, info);
    expect(result).to.eql(apiData);
    done();
  });
});
