import { World } from "@colyseus/ecs";
import { Room, Client } from "colyseus";
import {
  Circle,
  Movement,
  Intersecting,
  MessageComponent,
  CanvasContext,
  DemoSettings,
  State,
  MessageSystem,
  MovementSystem,
  IntersectionSystem,
  random,
} from "@ecstest/shared";

export class MyRoom extends Room<State> {
  world = new World();

  onCreate(options: any) {
    this.setState(new State());

    this.world.useEntities(this.state.entities);

    this.world
      .registerComponent(Circle)
      .registerComponent(Movement)
      .registerComponent(Intersecting)
      .registerComponent(CanvasContext)
      .registerComponent(DemoSettings)
      .registerComponent(MessageComponent)
      .registerSystem(MovementSystem)
      .registerSystem(IntersectionSystem)
      .registerSystem(MessageSystem);

    // Used for singleton components
    var singletonEntity = this.world
      .createEntity()
      .addComponent(CanvasContext)
      .addComponent(DemoSettings);

    const width = 800;
    const height = 600;

    const canvasComponent = singletonEntity.getMutableComponent(CanvasContext);
    canvasComponent.width = width;
    canvasComponent.height = height;

    for (var i = 0; i < 30; i++) {
      var entity = this.world
        .createEntity()
        .addComponent(Circle)
        .addComponent(Movement);

      const circle = entity.getMutableComponent(Circle);
      circle.position.set(random(0, width), random(0, height));
      circle.radius = random(20, 100);

      const movement = entity.getMutableComponent(Movement);
      movement.velocity.set(random(-20, 20), random(-20, 20));
    }

    let justDelayABit = 0;

    this.setSimulationInterval((delta) => {
      justDelayABit++;
      if (justDelayABit > 100) {
        justDelayABit = 0;
        this.world.createEntity().addComponent(MessageComponent);
      }

      this.world.execute(delta);
    });
  }

  onJoin(client: Client, options: any) {}

  onLeave(client: Client, consented: boolean) {}

  onDispose() {
    this.world.stop();
  }
}
